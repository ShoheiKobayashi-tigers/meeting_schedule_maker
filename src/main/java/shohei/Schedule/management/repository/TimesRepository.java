package shohei.Schedule.management.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import shohei.Schedule.management.repository.entity.Times;

@Mapper
public interface TimesRepository {

  @Select("SELECT * FROM times")
  List<Times> setTimes();

  @Insert("INSERT INTO times VALUES(#{startTime}, #{endTime})")
  void addTime(Times times);

  @Delete("DELETE FROM times WHERE start_time = #{startTime}")
  void deleteTimes(LocalDateTime startTime);
}
