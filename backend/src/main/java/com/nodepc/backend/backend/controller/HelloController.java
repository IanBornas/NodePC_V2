package com.nodepc.backend.backend.controller;


import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/backend/hello")
    public String hello(){
        return "Welcome the the NodePC Backend";
    }
}
