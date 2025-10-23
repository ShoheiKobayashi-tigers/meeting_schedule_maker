package shohei.Schedule.management.controller;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import shohei.Schedule.management.controller.form.StudentForm;
import shohei.Schedule.management.service.StudentsService;

@Controller
public class StudentsController {

  @Autowired
  private StudentsService studentsService;

  /*csvアップロード画面表示*/
  @GetMapping("/schedule/studentManagement/setStudentData")
  public ModelAndView setStudentData() {
    ModelAndView mav = new ModelAndView();
    mav.setViewName("setStudentData");
    return mav;
  }

  /*csvファイルをDBに登録*/
  @PostMapping("/schedule/studentManagement/setStudentData/add")
  public ModelAndView addStudentData(@RequestParam("file") MultipartFile file) {
    ModelAndView mav = new ModelAndView();
    if (file.isEmpty()) {
      mav.addObject("message", "ファイルを選択してください。");
      mav.setViewName("/setStudentData");
      return mav;
    }

    // 拡張子とMIMEタイプを検証（より厳密なチェック）
    if (!"text/csv".equals(file.getContentType()) && !file.getOriginalFilename().endsWith(".csv")) {
      mav.addObject("message", "CSVファイルを選択してください。");
      mav.setViewName("/setStudentData");
      return mav;
    }

    //csvファイルの中身をString[] records に変換
    try (Reader reader = new InputStreamReader(file.getInputStream());
        CSVReader csvReader = new CSVReader(reader)) {
      List<String[]> records = csvReader.readAll();
      /*既存の児童データを削除*/
      studentsService.deleteStudentData();
      /*csvファイルのデータをPostgresのstudentsテーブルに登録*/
      studentsService.setStudentData(records);
      mav.setViewName("redirect:/schedule/studentManagement");
      return mav;
    } catch (IOException | CsvException e) {
      mav.addObject("message", "CSVファイルの処理中にエラーが発生しました。");
      return mav;
    }
  }

  @GetMapping("/schedule/studentManagement")
  public ModelAndView studentManagement() {
    ModelAndView mav = new ModelAndView();
    List<StudentForm> students = studentsService.findAllStudents();
    mav.setViewName("/studentManagement");
    mav.addObject("students", students);
    return mav;
  }

  @PostMapping("/schedule/studentManagement/deleteBrother/{id}")
  public ModelAndView deleteBrother(@PathVariable Integer id) {
    studentsService.deleteBrother(id);
    return new ModelAndView("redirect:/schedule/studentManagement");
  }

  @GetMapping("/schedule/studentManagement/addBrother/{id}")
  public ModelAndView addBrother(@PathVariable Integer id) {
    ModelAndView mav = new ModelAndView();
    StudentForm studentForm = studentsService.findById(id);
    mav.setViewName("/addBrother");
    mav.addObject("studentForm", studentForm);
    return mav;
  }

  @PostMapping("/schedule/studentManagement/addBrother/add")
  public ModelAndView tryAddBrother(@ModelAttribute StudentForm studentForm) {
    ModelAndView mav = new ModelAndView();
    if (studentForm.getNewBrother() == null) {
      mav.addObject("message", "兄弟の日程を入力してください");
      mav.setViewName("/addBrother");
      return mav;
    } else if (studentForm.getNewBrother().getMinute() % 15 != 0) {
      mav.addObject("message", "時刻は15分間隔で入力してください");
      mav.setViewName("/addBrother");
      return mav;
    }
    studentsService.addBrother(studentForm);
    mav.setViewName("redirect:/schedule/studentManagement");
    return mav;
  }

}
