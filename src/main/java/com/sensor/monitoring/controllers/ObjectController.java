package com.sensor.monitoring.controllers;


import com.sensor.monitoring.models.Contact;
import com.sensor.monitoring.models.MonitoringObject;
import com.sensor.monitoring.repository.ObjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ObjectController {

    @Autowired
    private ObjectRepo objectRepo;

    @GetMapping("/object/add")
    public String objectInfo(Model model) {
        Iterable<MonitoringObject> objects = objectRepo.findAll();
        model.addAttribute("objects", objects);
        return "object-info";
    }

    @PostMapping("/object/add")
    public String addObject(MonitoringObject monitoringObject, Contact contact, Model model) {
        MonitoringObject objectFromDB = objectRepo.findByName(monitoringObject.getName());
        if (objectFromDB != null) {
            model.addAttribute("message", "Object is already exist!");
            Iterable<MonitoringObject> objects = objectRepo.findAll();
            model.addAttribute("objects", objects);
            return "object-info";
        }
        monitoringObject.setContact(contact);
        objectRepo.save(monitoringObject);
        return "redirect:/object";
    }

    @GetMapping("/object/delete/{id}")
    public String deleteObject(@PathVariable("id") int id) {
        objectRepo.deleteById(id);
        return "redirect:/object";
    }

    @GetMapping("/object/update/{id}")
    public String updateObject(@PathVariable("id") int id, Model model) {
        Iterable<MonitoringObject> objects = objectRepo.findAll();
        MonitoringObject objectForUpdate = objectRepo.findById(id);
        model.addAttribute("objects", objects);
        model.addAttribute("objectForUpdate", objectForUpdate);
        return "object-info";
    }


}
