package com.sensor.monitoring.controllers;

import com.sensor.monitoring.models.Sensor;
import com.sensor.monitoring.repository.InclRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class SensorsController {

    @Autowired
    InclRepo inclRepo;

    @GetMapping("/sensors/add")
    public String sensorInfo(Model model) {
        Iterable<Sensor> sensors = inclRepo.findAll();
        model.addAttribute("sensors", sensors);
        return "sensors/sensor-info";
    }

    @PostMapping("/sensors/add")
    public String addSensor(Sensor sensor, Model model) {
        Sensor sensorFromDB = inclRepo.findByFactoryId(sensor.getFactoryId());
        //Update if exist
        if (sensorFromDB != null) {
            sensor.setId(sensorFromDB.getId());
            Iterable<Sensor> sensors = inclRepo.findAll();
            model.addAttribute("sensors", sensors);
            inclRepo.save(sensor);
            return "sensors/sensor-info";
        }
        //Save
        inclRepo.save(sensor);
        return "redirect:/sensors";
    }

    @GetMapping("/sensors/delete/{factoryId}")
    public String deleteSensor(@PathVariable("factoryId") String factoryId) {
        inclRepo.deleteByFactoryId(factoryId);
        return "redirect:/sensors";
    }

    @GetMapping("/sensors/update/{factoryId}")
    public String updateSensor(@PathVariable("factoryId") String factoryId, Model model) {
        Iterable<Sensor> sensors = inclRepo.findAll();
        Sensor sensorForUpdate = inclRepo.findByFactoryId(factoryId);
        model.addAttribute("sensors", sensors);
        model.addAttribute("sensorForUpdate", sensorForUpdate);
        return "sensors/sensor-info";
    }
}
