package com.sensor.monitoring.repository;

import com.sensor.monitoring.models.Values;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

public interface ValuesRepo extends CrudRepository<Values, Long> {

    List<Values> findValuesBySensorId(Long sensorId);

    Values findValuesById(Long id);


    @Query(value = "select v from Values v where v.sensorId = ?1 and v.date = (select max(date) from Values where sensorId = ?1)")
    @Transactional
    Values lastValues(Long sensorId);

}
