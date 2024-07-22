package org.do_an.be.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(("/api/admin"))
@CrossOrigin
public class AdminController {
    @GetMapping("/")
    public String helloAdmin(){
        return "Admin level access";
    }
}
