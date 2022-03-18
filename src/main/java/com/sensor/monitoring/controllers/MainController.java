package com.sensor.monitoring.controllers;

import com.sensor.monitoring.models.Sensor;
import com.sensor.monitoring.models.User;
import com.sensor.monitoring.models.Values;
import com.sensor.monitoring.repository.InclRepo;
import com.sensor.monitoring.repository.UserRepo;
import com.sensor.monitoring.repository.ValuesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class MainController {

    @Autowired
    private InclRepo inclRepo;

    @Autowired
    private ValuesRepo valuesRepo;

    @Autowired
    private UserRepo userRepo;

    @GetMapping("/")
    public String home(Model model) {
        Long sensorsCount = inclRepo.count();
        Long usersCount = userRepo.count();
        model.addAttribute("sensorsCount", sensorsCount);
        model.addAttribute("usersCount", usersCount);
        return "home";
    }


    @GetMapping("/sensors")
    public String sensors(Model model) {
        Iterable<Sensor> sensors = inclRepo.findAll();
        ArrayList<Values> res = new ArrayList<>();
        int i = 0;
        for (Sensor sensor : sensors) {
            List<Values> values = valuesRepo.findValuesBySensorId(sensor.getId());
            res.add(values.get(i));
            i += 1;
        }
        model.addAttribute("values", res);
        model.addAttribute("sensors", sensors);
        return "sensors";
    }

    @GetMapping("/users")
    public String users(Model model) {
        List<User> users = userRepo.findAll();
        model.addAttribute("users", users);
        return "users";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/sensors/wish")
    public @ResponseBody
    Values wish(final @RequestParam("name") String name) {
        Long sensorId = Long.parseLong(name);
        Values values = valuesRepo.lastValues(sensorId);
        return values;
    }
}
