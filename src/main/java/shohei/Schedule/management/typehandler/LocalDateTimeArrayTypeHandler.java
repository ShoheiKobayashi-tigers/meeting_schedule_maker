package shohei.Schedule.management.typehandler;

import java.sql.Array;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

public class LocalDateTimeArrayTypeHandler extends BaseTypeHandler<List<LocalDateTime>> {

  @Override
  public void setNonNullParameter(PreparedStatement ps, int i, List<LocalDateTime> parameter,
      JdbcType jdbcType) throws SQLException {
    // List<LocalDateTime>をObject[]に変換
    Object[] timestamps = parameter.toArray(new Object[0]);
    // PostgreSQLの配列型に変換してセット
    Array sqlArray = ps.getConnection().createArrayOf("timestamp", timestamps);
    ps.setArray(i, sqlArray);
  }

  @Override
  public List<LocalDateTime> getNullableResult(ResultSet rs, String columnName)
      throws SQLException {
    Array pgArray = rs.getArray(columnName);
    if (pgArray == null) {
      return null;
    }

    // 配列の要素を一つずつLocalDateTimeに変換
    Object[] array = (Object[]) pgArray.getArray();
    List<LocalDateTime> localDateTimeList = new ArrayList<>(array.length);
    for (Object element : array) {
      localDateTimeList.add(((Timestamp) element).toLocalDateTime());
    }
    return localDateTimeList;
  }

  @Override
  public List<LocalDateTime> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
    Array pgArray = rs.getArray(columnIndex);
    if (pgArray == null) {
      return null;
    }

    Object[] array = (Object[]) pgArray.getArray();
    List<LocalDateTime> localDateTimeList = new ArrayList<>(array.length);
    for (Object element : array) {
      localDateTimeList.add(((Timestamp) element).toLocalDateTime());
    }
    return localDateTimeList;
  }

  @Override
  public List<LocalDateTime> getNullableResult(CallableStatement cs, int columnIndex)
      throws SQLException {
    Array pgArray = cs.getArray(columnIndex);
    if (pgArray == null) {
      return null;
    }

    Object[] array = (Object[]) pgArray.getArray();
    List<LocalDateTime> localDateTimeList = new ArrayList<>(array.length);
    for (Object element : array) {
      localDateTimeList.add(((Timestamp) element).toLocalDateTime());
    }
    return localDateTimeList;
  }
}