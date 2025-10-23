package shohei.Schedule.management.controller.form;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimesForm {

  @NotNull(message = "開始日時を入力してください")
  LocalDateTime startTime;
  @NotNull(message = "終了日時を入力してください")
  LocalDateTime endTime;

  @AssertTrue(message = "開始日時と終了日時の組み合わせが不正です")
  public boolean isAfter() {
    if (startTime != null && endTime != null) {
      return endTime.isAfter(startTime);
    }
    return true;
  }
}
