package com.sensor.monitoring.repository;


import com.sensor.monitoring.models.MonitoringObject;
import org.springframework.data.repository.CrudRepository;

public interface ObjectRepo extends CrudRepository<MonitoringObject, Integer> {
    MonitoringObject findByName(String name);

    MonitoringObject findById(int id);

    void deleteById(int id);

}
