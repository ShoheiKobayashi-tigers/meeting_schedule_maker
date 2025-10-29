package shohei.Schedule.management.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import shohei.Schedule.management.controller.form.TimesForm;
import shohei.Schedule.management.service.TimesService;

@RestController
public class TimesController {

  @Autowired
  private TimesService timesService;

  @GetMapping("/schedule/api/timesList")
  public List<TimesForm> getTimesApi() {
    List<TimesForm> times = timesService.getTimes();
    return times;
  }

  @PostMapping("/schedule/api/timesList/add")
  public ResponseEntity<String> addTimesApi(@Validated @RequestBody TimesForm timesForm,
      // ★JSONを受け取るため@RequestBodyを使う
      BindingResult result) {
    if (result.hasErrors()) {
      // 400 Bad Request とエラーメッセージを返す
      return new ResponseEntity<>("Validation failed", HttpStatus.BAD_REQUEST);
    }
    timesService.addTime(timesForm);
    // 200 OK と成功メッセージを返す
    return new ResponseEntity<>("Time added successfully", HttpStatus.OK);
  }
 /*
 日程削除機能
  @PostMapping("/schedule/api/timeList/delete/{startTime}")
  public ResponseEntity<Void> deleteTimesApi(@PathVariable LocalDateTime startTime) {

    // サービス層の削除処理を実行し、結果（boolean）を受け取る
    boolean isDeleted = timesService.deleteTimes(startTime);

    if (isDeleted) {
      // 成功: 204 No Content を返す
      return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    } else {
      // 失敗: 404 Not Found を返す（削除対象が見つからなかったため）
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

 */
}
