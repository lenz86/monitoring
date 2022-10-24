package com.sensor.monitoring.repository;


import com.sensor.monitoring.models.MonitoringObject;
import org.springframework.data.repository.CrudRepository;

public interface ObjectRepo extends CrudRepository<MonitoringObject, Long> {
    MonitoringObject findByName(String name);

}
