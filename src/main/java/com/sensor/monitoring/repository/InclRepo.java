package com.sensor.monitoring.repository;

import com.sensor.monitoring.models.Sensor;
import org.springframework.data.repository.CrudRepository;

public interface InclRepo extends CrudRepository<Sensor, Long> {
    Sensor findByFactoryId(String factoryId);
}
