package shohei.Schedule.management.controller.form;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
public class StudentForm {

  private Integer id;
  private String name;
  private LocalDateTime currentSet;
  private LocalDateTime newBrother;
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private List<LocalDateTime> brotherSet;
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private List<LocalDateTime> requestedTimes;
  private Integer colorFlag;
}
