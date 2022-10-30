package com.sensor.monitoring.controllers;

import com.sensor.monitoring.models.Sensor;
import com.sensor.monitoring.repository.InclRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SensorsLocationController {

    @Autowired
    InclRepo inclRepo;

    @GetMapping("/sensors_location/{floorNumber}")
    public String sensorsLocation(@PathVariable("floorNumber") String floorNumber, Model model) {
        Iterable<Sensor> sensors = inclRepo.findAll();
        model.addAttribute("sensors", sensors);
        model.addAttribute("title", "Apartments №7.  " + floorNumber + " floor");
        model.addAttribute("floorName", floorNumber.toLowerCase());
        return "sensors/sensors-location";
    }
}
