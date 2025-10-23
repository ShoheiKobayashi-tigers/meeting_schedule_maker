package shohei.Schedule.management.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shohei.Schedule.management.controller.form.StudentForm;
import shohei.Schedule.management.repository.StudentsRepository;
import shohei.Schedule.management.repository.entity.Student;

@Service
@Transactional
public class StudentsService {

  @Autowired
  private StudentsRepository studentsRepository;

  private final LocalDateTime defaultTime = LocalDateTime.of(2000, 1, 1, 0, 0);

  /*
   * 主に、児童管理画面の機能
   * */
  /*新規児童データ登録前に、既存の児童データを削除*/
  public void deleteStudentData() {
    studentsRepository.deleteStudentData();
  }

  /*児童データをPostgreSQLに登録*/
  public void setStudentData(List<String[]> records) {
    for (int i = 1; i < records.size(); i++) {
      String[] record = records.get(i);
      Student student = new Student();
      student.setId(Integer.parseInt(record[1]));
      student.setName(record[2]);
      List<LocalDateTime> brother = new ArrayList<>();
      if (StringUtils.isBlank(record[3])) {
        student.setBrotherSet(brother);
      } else {
        brother.add(defaultTime);
        student.setBrotherSet(brother);
      }
      String[] strRequestedTimes = record[4].split(", ");
      List<LocalDateTime> requestedTimes = new ArrayList<>();
      for (String strRequestedTime : strRequestedTimes) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH時mm分");
        LocalDateTime requestedTime = LocalDateTime.parse(strRequestedTime, formatter);
        requestedTimes.add(requestedTime);
      }
      student.setRequestedTimes(requestedTimes);
      studentsRepository.setStudentData(student);
    }
  }

  /*児童管理画面出力用*/
  public List<StudentForm> findAllStudents() {
    List<Student> results = studentsRepository.findAllStudents();
    List<StudentForm> students = setAllStudentForm(results);
    return students;
  }

  /*TOP画面出力用*/
  public List<StudentForm> findAllStudentsOrderByRequest() {
    List<Student> results = studentsRepository.findAllStudentsOrderByRequest();
    List<StudentForm> students = setAllStudentForm(results);
    return students;
  }

  /*すべてのEntityをList<StudentForm>に変換*/
  private List<StudentForm> setAllStudentForm(List<Student> results) {
    List<StudentForm> students = new ArrayList<>();
    for (Student result : results) {
      students.add(setStudentForm(result));
    }
    return students;
  }

  /*TOP画面で自動押下時の児童を表示、児童管理画面のバリデーション*/
  public StudentForm findById(Integer id) {
    Student student = studentsRepository.findById(id);
    if (student == null) {
      return null;
    }
    return setStudentForm(student);
  }

  public StudentForm findByCurrentSet(LocalDateTime selectedTime) {
    Student student = studentsRepository.findByCurrentSet(selectedTime);
    if (student == null) {
      return null;
    } else {
      return setStudentForm(student);
    }
  }

  /*EntityをStudentFormに変換*/
  private StudentForm setStudentForm(Student result) {
    StudentForm studentForm = new StudentForm();
    studentForm.setId(result.getId());
    studentForm.setName(result.getName());
    if (result.getCurrentSet() != null) {
      studentForm.setCurrentSet(result.getCurrentSet());
    } else {
      studentForm.setCurrentSet(null);
    }
    if (result.getBrotherSet() != null) {
      studentForm.setBrotherSet(result.getBrotherSet());
    }
    studentForm.setRequestedTimes(result.getRequestedTimes());
    return studentForm;
  }

  /*兄弟の日程を追加
   * 新規追加の場合は、defaultBrotherを削除してから追加*/
  public void addBrother(StudentForm studentForm) {
    List<LocalDateTime> brotherSet = studentForm.getBrotherSet();
    brotherSet.remove(defaultTime);
    brotherSet.add(studentForm.getNewBrother());
    studentForm.setBrotherSet(brotherSet);
    studentsRepository.updateBrother(setEntity(studentForm));
  }

  /*兄弟の日程を削除（兄弟自体は削除しない）
   * 兄弟がいない児童と区別するために、defaultBrotherのみのリストを作って詰める*/
  public void deleteBrother(Integer id) {
    Student student = studentsRepository.findById(id);
    List<LocalDateTime> defaultBrother = new ArrayList<>();
    defaultBrother.add(defaultTime);
    student.setBrotherSet(defaultBrother);
    studentsRepository.updateBrother(student);
  }

  /*StudentFormをEntityに変換*/
  private Student setEntity(StudentForm studentForm) {
    Student student = new Student();
    student.setId(studentForm.getId());
    student.setName(studentForm.getName());
    student.setCurrentSet(studentForm.getCurrentSet());
    student.setBrotherSet(studentForm.getBrotherSet());
    student.setRequestedTimes(studentForm.getRequestedTimes());
    return student;
  }

  /*
   * 主に、TOP画面から使う機能
   * */
  /*設定済み児童の日程を削除*/
  public void updateCurrentSetNull(LocalDateTime time) {
    studentsRepository.updateCurrentSetNull(time);
  }

  /*指定された日程に、指定された児童を追加*/
  public void addNewStudent(LocalDateTime targetTime, Integer studentId) {
    Student student = studentsRepository.findById(studentId);
    student.setCurrentSet(targetTime);
    studentsRepository.updateCurrentSet(student);
  }

  public void changeStudents(Integer id, LocalDateTime selectedTime, LocalDateTime targetTime) {
    Student targetStudent;
    Student selectedStudent;
    /*既に入っている人同士*/
    if (targetTime == null) {
      selectedStudent = studentsRepository.findByCurrentSet(selectedTime);
      targetStudent = studentsRepository.findById(id);
      selectedStudent.setCurrentSet(targetStudent.getCurrentSet());
      targetStudent.setCurrentSet(selectedTime);
      studentsRepository.updateCurrentSetNull(targetStudent.getCurrentSet());
      studentsRepository.updateCurrentSetNull(selectedTime);
    } else {
      /*未定児童と既に入っている人*/
      selectedStudent = studentsRepository.findById(id);
      targetStudent = studentsRepository.findByCurrentSet(targetTime);
      selectedStudent.setCurrentSet(targetTime);
      targetStudent.setCurrentSet(null);
    }
    studentsRepository.updateCurrentSet(targetStudent);
    studentsRepository.updateCurrentSet(selectedStudent);
  }

  public void moveStudent(LocalDateTime selectedTime, LocalDateTime targetTime) {
    Student selectedStudent = studentsRepository.findByCurrentSet(selectedTime);
    Student targetStudent = studentsRepository.findByCurrentSet(targetTime);
    if (selectedStudent == null) {
      targetStudent.setCurrentSet(selectedTime);
      studentsRepository.updateCurrentSet(targetStudent);
    } else {
      selectedStudent.setCurrentSet(targetTime);
      studentsRepository.updateCurrentSet(selectedStudent);
    }
  }
}
