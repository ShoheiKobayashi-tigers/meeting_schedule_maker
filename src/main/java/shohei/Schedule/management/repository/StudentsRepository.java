package shohei.Schedule.management.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import shohei.Schedule.management.repository.entity.Student;

@Mapper
public interface StudentsRepository {

  @Delete("DELETE FROM students")
  void deleteStudentData();

  @Insert("INSERT INTO students (id, name, brother_set, requested_Times) VALUES (#{id}, #{name}, #{brotherSet, jdbcType=ARRAY}, #{requestedTimes, jdbcType=ARRAY}) ")
  void setStudentData(Student student);

  @Select("SELECT * FROM students ORDER BY id")
  List<Student> findAllStudents();

  @Select("SELECT * FROM students WHERE id = #{id}")
  Student findById(Integer id);

  @Select("SELECT * FROM students WHERE current_set = #{selectedTime}")
  Student findByCurrentSet(LocalDateTime selectedTime);

  @Select("SELECT * FROM students ORDER BY array_length(brother_set, 1), array_length(requested_times, 1)")
  List<Student> findAllStudentsOrderByRequest();

  @Update("UPDATE students SET brother_set = #{brotherSet, jdbcType=ARRAY} WHERE id = #{id}")
  void updateBrother(Student student);

  @Update("UPDATE students SET current_set = null WHERE current_set = #{time}")
  void updateCurrentSetNull(LocalDateTime time);

  @Update("UPDATE students SET current_set = #{currentSet} WHERE id = #{id}")
  void updateCurrentSet(Student student);
}