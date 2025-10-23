package shohei.Schedule.management.repository.entity;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Times {

  LocalDateTime startTime;
  LocalDateTime endTime;

}
