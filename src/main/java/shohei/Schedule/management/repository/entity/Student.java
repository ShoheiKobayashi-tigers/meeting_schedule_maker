package shohei.Schedule.management.repository.entity;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Student {

  private Integer id;
  private String name;
  private LocalDateTime currentSet;
  private List<LocalDateTime> brotherSet;
  private List<LocalDateTime> requestedTimes;

}
