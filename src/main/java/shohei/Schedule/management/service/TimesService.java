package shohei.Schedule.management.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import shohei.Schedule.management.controller.form.TimesForm;
import shohei.Schedule.management.repository.TimesRepository;
import shohei.Schedule.management.repository.entity.Times;

@Service
@Transactional
public class TimesService {

  @Autowired
  TimesRepository timesRepository;

  /*登録済みの日時を表示*/
  public List<TimesForm> getTimes() {
    List<Times> times = timesRepository.setTimes();
    return setForm(times);
  }

  /*取得したEntityをFormに設定*/
  private List<TimesForm> setForm(List<Times> results) {
    List<TimesForm> allTime = new ArrayList<>();
    for (Times result : results) {
      TimesForm times = new TimesForm();
      times.setStartTime(result.getStartTime());
      times.setEndTime(result.getEndTime());
      allTime.add(times);
    }
    return allTime;
  }

  /*すべての面談開始時刻を生成して表示*/
  public Map<LocalDateTime, Integer> getAllTime() {
    List<Times> setTimes = timesRepository.setTimes();
    return makeAllTime(setTimes);
  }

  private Map<LocalDateTime, Integer> makeAllTime(List<Times> setTimes) {
    Map<LocalDateTime, Integer> allTime = new HashMap<>();
    for (Times setTime : setTimes) {
      for (LocalDateTime time = setTime.getStartTime();
          !time.isAfter(setTime.getEndTime().minusMinutes(15));
          time = time.plusMinutes(15)) {
        allTime.put(time, null);
      }
    }
    return allTime;
  }

  /*日時新規登録*/
  public void addTime(TimesForm timesForm) {
    Times times = setEntity(timesForm);
    timesRepository.addTime(times);
  }

  /*取得したFormをEntityにセット*/
  private Times setEntity(TimesForm timesForm) {
    Times times = new Times();
    times.setStartTime(timesForm.getStartTime());
    times.setEndTime(timesForm.getEndTime());
    return times;
  }

  public boolean deleteTimes(LocalDateTime startTime) {
    List<Times> times = timesRepository.findTimes(startTime);
    if (times.size() == 1) {
      timesRepository.deleteTimes(startTime);
      return true;
    } else {
      return false;
    }
  }
}
