package shohei.Schedule.management.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import shohei.Schedule.management.controller.form.ScheduleResponse;
import shohei.Schedule.management.controller.form.StudentForm;
import shohei.Schedule.management.service.FlagsService;
import shohei.Schedule.management.service.StudentsService;
import shohei.Schedule.management.service.TimesService;

@RestController
public class TopController {

  @Autowired
  StudentsService studentsService;
  @Autowired
  TimesService timesService;
  @Autowired
  FlagsService flagsService;

  @GetMapping("/schedule")
  public ScheduleResponse top() {
    List<StudentForm> students = studentsService.findAllStudentsOrderByRequest();
    Map<LocalDateTime, Integer> allTime = timesService.getAllTime();
    List<Entry<LocalDateTime, Integer>> flaggedAllTime = flagsService.setTimeFlag(allTime, students)
        .entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .collect(Collectors.toList());
    return new ScheduleResponse(students, flaggedAllTime, null);
  }

  @GetMapping("/schedule/time/{time}")
  public ScheduleResponse setFlagOfTime(
      @PathVariable("time") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime selectedTime) {
    List<StudentForm> students = studentsService.findAllStudentsOrderByRequest();
    Map<LocalDateTime, Integer> allTime = timesService.getAllTime();
    List<StudentForm> flaggedStudents = flagsService.setStudentFlag(students, selectedTime);
    List<Entry<LocalDateTime, Integer>> flaggedAllTime = flagsService.setTimeFlagByTime(allTime,
            students,
            selectedTime)
        .entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .toList();/*collect(Collectors.toList())をtoList()に置き換えられるということだったので、変えてみた。*/
    return new ScheduleResponse(students, flaggedAllTime, flaggedStudents);
  }

  @GetMapping("/schedule/student/{id}")
  public ScheduleResponse setFlagOfName(@PathVariable("id") Integer id) {
    List<StudentForm> students = studentsService.findAllStudentsOrderByRequest();
    Map<LocalDateTime, Integer> allTime = timesService.getAllTime();
    StudentForm selectedStudent = studentsService.findById(id);
    List<StudentForm> flaggedStudents = flagsService.setStudentFlag(students, id);
    List<Entry<LocalDateTime, Integer>> flaggedAllTime = flagsService.setTimeFlagById(allTime,
            students,
            selectedStudent)
        .entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .toList();/*collect(Collectors.toList())をtoList()に置き換えられるということだったので、変えてみた。*/
    return new ScheduleResponse(students, flaggedAllTime, flaggedStudents);
  }

  @PostMapping("/schedule/delete/{time}")
  public ModelAndView updateCurrentSetNull(
      @PathVariable("time") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime time) {
    studentsService.updateCurrentSetNull(time);
    return new ModelAndView("redirect:/schedule");
  }

  @PostMapping("/schedule/add")
  public ModelAndView addNewStudent(
      @RequestParam("targetTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime targetTime,
      @RequestParam("studentId") Integer studentId) {
    studentsService.addNewStudent(targetTime, studentId);
    return new ModelAndView("redirect:/schedule");
  }

  @PostMapping("/schedule/change")
  public ModelAndView changeStudents(
      @RequestParam("studentId") Integer studentId,
      @RequestParam(value = "selectedTime", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime selectedTime,
      @RequestParam(value = "targetTime", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime targetTime) {
    studentsService.changeStudents(studentId, selectedTime, targetTime);
    return new ModelAndView("redirect:/schedule");
  }

  @PostMapping("/schedule/move")
  public ModelAndView move(
      @RequestParam("selectedTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime selectedTime,
      @RequestParam("targetTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime targetTime) {
    studentsService.moveStudent(selectedTime, targetTime);
    return new ModelAndView("redirect:/schedule");
  }
}
