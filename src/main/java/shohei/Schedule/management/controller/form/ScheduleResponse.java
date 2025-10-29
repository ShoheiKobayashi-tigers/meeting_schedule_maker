package shohei.Schedule.management.controller.form;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map.Entry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ScheduleResponse {

  private List<StudentForm> students;
  private List<Entry<LocalDateTime, Integer>> allTime;
  private List<StudentForm> flaggedStudents;
}
