package shohei.Schedule.management.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import shohei.Schedule.management.controller.form.StudentForm;

@Service
public class FlagsService {

  @Autowired
  TimesService timesService;

  private final LocalDateTime defaultTime = LocalDateTime.of(2000, 1, 1, 0, 0);

  /*フラグ定義*/
  /*
   * 児童
   * リンクあり、ボタンなし ---> default(null)
   */
  private final int SET_STUDENT_LINK_ADD_BUTTON = 1;
  private final int SET_STUDENT_LINK_CHANGE_BUTTON = 2;
  private final int NOT_STUDENT_LINK_NOT_BUTTON = 3;

  /*
   * 日程
   * リンクあり、ボタンなし ---> default(null)
   * */
  private final int SET_TIME_LINK_DELETE_BUTTON = 1;
  private final int SET_TIME_LINK_ADD_BUTTON = 2;
  private final int SET_TIME_LINK_CHANGE_BUTTON = 3;
  private final int SET_TIME_LINK_MOVE_BUTTON = 4;
  private final int NOT_TIME_LINK_NOT_BUTTON = 5;
  private final int NOT_TIME_LINK_DELETE_BUTTON = 6;


  /*
   * フラグ設定機能
   * */
  /*日程が押下されたときの児童の設定*/
  public List<StudentForm> setStudentFlag(List<StudentForm> students,
      LocalDateTime selectedTime) {
    for (StudentForm student : students) {
      /*押下された日程に入れるかどうか*/
      if (isSettable(selectedTime, student)) {
        /*そこに人がいなかったら、追加*/
        if (getSelectedStudent(selectedTime, students) == null) {
          student.setColorFlag(SET_STUDENT_LINK_ADD_BUTTON);
        } else {
          /*いれば、交代する（そこにいた児童は、未定児童に帰ってくるだけ。絶対に入れる）*/
          student.setColorFlag(SET_STUDENT_LINK_CHANGE_BUTTON);
        }
      }
    }
    return students;
  }

  /*未定児童が押下されたときの児童の設定*/
  public List<StudentForm> setStudentFlag(List<StudentForm> students,
      Integer id) {
    /*ボタンはみんななし。押下された児童だけがリンクなし*/
    for (StudentForm student : students) {
      if (student.getCurrentSet() == null && student.getId().equals(id)) {
        student.setColorFlag(NOT_STUDENT_LINK_NOT_BUTTON);
      }
    }
    return students;
  }

  /*TOP画面の日程の設定（児童はみんなデフォルトだから関係ない）*/
  public Map<LocalDateTime, Integer> setTimeFlag(Map<LocalDateTime, Integer> allTime,
      List<StudentForm> students) {
    /*みんなリンクあり*/
    for (LocalDateTime time : allTime.keySet()) {
      StudentForm student = getSelectedStudent(time, students);
      /*その日程に児童が入っていたら、削除*/
      if (student != null) {
        allTime.put(time, SET_TIME_LINK_DELETE_BUTTON);
      }
    }
    return allTime;
  }

  /*日程が押下された時の、日程の形式を設定*/
  public Map<LocalDateTime, Integer> setTimeFlagByTime(Map<LocalDateTime, Integer> allTime,
      List<StudentForm> students, LocalDateTime selectedTime) {
    StudentForm selectedStudent = getSelectedStudent(selectedTime, students);
    for (LocalDateTime time : allTime.keySet()) {
      /*選択された日程はリンクなし*/
      if (time.isEqual(selectedTime)) {
        /*selectedTimeに児童がいたら、削除*/
        if (getSelectedStudent(time, students) != null) {
          allTime.put(time, NOT_TIME_LINK_DELETE_BUTTON);
        } else {
          /*selectedTimeに児童がいなかったら、ボタンもなし*/
          allTime.put(time, NOT_TIME_LINK_NOT_BUTTON);
        }
        continue;
      }
      StudentForm student = getSelectedStudent(time, students);
      /*timeにもselectedTimeにも児童がいて、お互いにその日程に入れたら、交代する*/
      if (selectedStudent != null && isSettable(time, selectedStudent) && student != null
          && isSettable(selectedTime, student)) {
        allTime.put(time, SET_TIME_LINK_CHANGE_BUTTON);
        continue;
      }
      /*timeには児童がいないが、selectedTimeに児童がいて、その児童がtimeに入れたら、移動する*/
      if (selectedStudent != null && isSettable(time, selectedStudent) && student == null) {
        allTime.put(time, SET_TIME_LINK_MOVE_BUTTON);
        continue;
      }
      /*selectedTimeには児童がいないが、timeに児童がいて、その児童がselectedTimeに入れたら、移動する*/
      if (selectedStudent == null && student != null && isSettable(selectedTime, student)) {
        allTime.put(time, SET_TIME_LINK_MOVE_BUTTON);
      }
    }
    return allTime;
  }

  /*未定児童が押下された時の、日程の形式を設定*/
  public Map<LocalDateTime, Integer> setTimeFlagById(Map<LocalDateTime, Integer> allTime,
      List<StudentForm> students, StudentForm selectedStudent) {
    for (LocalDateTime time : allTime.keySet()) {
      if (isSettable(time, selectedStudent)) {
        if (getSelectedStudent(time, students) == null) {
          allTime.put(time, SET_TIME_LINK_ADD_BUTTON);
        } else {
          allTime.put(time, SET_TIME_LINK_CHANGE_BUTTON);
        }
      }
    }
    return allTime;
  }

  /*
  使いまわす機能たち
  */
  /*その日程に、誰か児童が入っているかを判定
  private boolean isAlready(LocalDateTime time, List<StudentForm> students) {
    for (StudentForm student : students) {
      if (student.getCurrentSet() != null && time.isEqual(student.getCurrentSet())) {
        return true;
      }
    }
    return false;
  }
  */

  /*その日程に一致する児童を取得*/
  private StudentForm getSelectedStudent(LocalDateTime time, List<StudentForm> students) {
    for (StudentForm student : students) {
      if (student.getCurrentSet() != null && time.isEqual(student.getCurrentSet())) {
        return student;
      }
    }
    return null;
  }

  /*その日程に、その児童が追加または更新できるかどうかを判定*/
  private boolean isSettable(LocalDateTime time, StudentForm student) {
    List<LocalDateTime> brotherSet = student.getBrotherSet();
    if (student.getRequestedTimes().contains(time)) {
      if (brotherSet != null && !brotherSet.contains(defaultTime)) {
        return judgeBrother(time, brotherSet);
      }
      return true;
    }
    return false;
  }

  /*兄弟がいる場合に使う。兄弟の日程を除く、前後2枠をtrue*/
  private boolean judgeBrother(LocalDateTime time, List<LocalDateTime> brotherSet) {
    if (brotherSet.contains(time)) {
      return false;
    }
    Set<LocalDateTime> settableTimes = new HashSet<>();
    Map<LocalDateTime, Integer> allTime = timesService.getAllTime();
    List<Integer> pattern = List.of(-30, -15, 15, 30);
    for (LocalDateTime brotherTime : brotherSet) {
      for (Integer minute : pattern) {
        if (!brotherSet.contains(brotherTime.plusMinutes(minute)) && allTime.containsKey(
            brotherTime.plusMinutes(minute))) {
          settableTimes.add(brotherTime.plusMinutes(minute));
        }
      }
    }
    return settableTimes.contains(time);
  }
}