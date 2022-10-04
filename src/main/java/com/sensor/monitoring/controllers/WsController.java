package com.sensor.monitoring.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WsController {

    @RequestMapping("/wstest")
    public String webSock() {
        return "ws-test.html";
    }

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public String sendMessage(@Payload String message) {
        return message;
    }
}
