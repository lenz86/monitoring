package com.sensor.monitoring.repository;

import com.sensor.monitoring.models.Sensor;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

public interface InclRepo extends CrudRepository<Sensor, Integer> {

    Sensor findByFactoryId(String factoryId);

    Sensor findByName(String name);

    @Transactional(value = Transactional.TxType.REQUIRED)
    void deleteByFactoryId(String factoryId);

}
