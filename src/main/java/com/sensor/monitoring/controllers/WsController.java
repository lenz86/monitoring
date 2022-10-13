package com.sensor.monitoring.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WsController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/public")
    public String sendMessage(@Payload String message) {
        return message;
    }
}
