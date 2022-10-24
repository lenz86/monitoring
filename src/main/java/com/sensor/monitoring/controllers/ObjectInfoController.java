package com.sensor.monitoring.controllers;


import com.sensor.monitoring.models.MonitoringObject;
import com.sensor.monitoring.repository.ObjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ObjectInfoController {

    @Autowired
    private ObjectRepo objectRepo;

    @GetMapping("/object/add")
    public String addObjectPage(Model model) {
        Iterable<MonitoringObject> objects = objectRepo.findAll();
        model.addAttribute("objects", objects);
        return "object-info-add";
    }

    @PostMapping("/object/add")
    public String addObject(MonitoringObject monitoringObject, Model model) {
        MonitoringObject objectFromDB = objectRepo.findByName(monitoringObject.getName());
        if (objectFromDB != null) {
            model.addAttribute("message", "Object is already exist!");
            Iterable<MonitoringObject> objects = objectRepo.findAll();
            model.addAttribute("objects", objects);
            return "object-info-add";
        }
        objectRepo.save(monitoringObject);
        return "redirect:/object";
    }



}
