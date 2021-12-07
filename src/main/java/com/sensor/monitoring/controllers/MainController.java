package com.sensor.monitoring.controllers;

import com.sensor.monitoring.models.Sensor;
import com.sensor.monitoring.repository.SensorsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class MainController {

    @Autowired
    private SensorsRepo sensorsRepo;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Monitoring Server");
        return "home";
    }


    @GetMapping("/sensors")
    public String sensors(Model model) {
        Iterable<Sensor> sensors = sensorsRepo.findAll();
        model.addAttribute("sensors", sensors);
        return "sensors";
    }

    @GetMapping("/sensors/add")
    public String sensorsAdd(Model model) {
        return "sensors-add";
    }

    @GetMapping("/sensors2")
    public String sensors2Add(Model model) {
        return "sensors2";
    }

//    @PostMapping("/sensorsadd")
//    public String sensorsPostAdd (@RequestParam String name, @RequestParam int factoryID, @RequestParam String version,
//                             int port, int address,  Model model ){
//        Sensor sensor = new  Sensor(name, factoryID, version, port, address);
//        sensorsRepo.save(sensor);
//        Iterable<Sensor> sensors = sensorsRepo.findAll();
//        model.addAttribute("sensors", sensors);
//        return "redirect:/sensors";
//    }


    @PostMapping("/sensors")
    public String addSensor (@RequestParam String name, @RequestParam int factoryID, @RequestParam String version,
                             int port, int address, Map<String, Object> model) {
        Sensor sensor = new  Sensor(name, factoryID, version, port, address);
        sensorsRepo.save(sensor);
        Iterable<Sensor> sensors = sensorsRepo.findAll();
        model.put("sensors", sensors);
        return "sensors";
    }

}
