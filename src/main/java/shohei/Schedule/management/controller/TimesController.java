package shohei.Schedule.management.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;
import shohei.Schedule.management.controller.form.TimesForm;
import shohei.Schedule.management.service.TimesService;

@Controller
public class TimesController {

  @Autowired
  private TimesService timesService;

  @GetMapping("/schedule/timesList")
  public ModelAndView setTimes() {
    ModelAndView mav = new ModelAndView();
    List<TimesForm> times = timesService.getTimes();
    List<Entry<LocalDateTime, Integer>> allTime = timesService.getAllTime().entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .collect(Collectors.toList());
    TimesForm time = new TimesForm();
    mav.setViewName("timeList");
    mav.addObject("times", times);
    mav.addObject("allTime", allTime);
    mav.addObject("timesForm", time);
    return mav;
  }

  @PostMapping("/schedule/timesList/add")
  public ModelAndView addTimes(@Validated @ModelAttribute TimesForm timesForm,
      BindingResult result) {
    if (result.hasErrors()) {
      ModelAndView mav = new ModelAndView();
      List<TimesForm> times = timesService.getTimes();
      Map<LocalDateTime, Integer> allTime = timesService.getAllTime();
      mav.setViewName("timeList");
      mav.addObject("times", times);
      mav.addObject("allTime", allTime);
      mav.addObject("timesForm", timesForm);
      return mav;
    }
    timesService.addTime(timesForm);
    return new ModelAndView("redirect:/schedule/timesList");
  }

  @PostMapping("/schedule/timeList/delete/{startTime}")
  public ModelAndView deleteTimes(@PathVariable LocalDateTime startTime) {
    timesService.deleteTimes(startTime);
    return new ModelAndView("redirect:/schedule/timesList");
  }
}
