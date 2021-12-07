package com.sensor.monitoring.repository;

import com.sensor.monitoring.models.Sensor;
import org.springframework.data.repository.CrudRepository;

public interface SensorsRepo extends CrudRepository<Sensor, Long> {
}
