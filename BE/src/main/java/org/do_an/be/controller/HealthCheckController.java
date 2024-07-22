package org.do_an.be.controller;

import lombok.AllArgsConstructor;
import org.do_an.be.entity.Category;
import org.do_an.be.responses.ResponseObject;
import org.do_an.be.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.util.List;

@RestController
@RequestMapping("api/healthcheck")
@AllArgsConstructor
public class HealthCheckController {
    private final CategoryService categoryService;
    @GetMapping("")
    public ResponseEntity<ResponseObject> healthCheck() throws Exception{
        List<Category> categories = categoryService.getAllCategories();
        // Get the computer name
        String computerName = InetAddress.getLocalHost().getHostName();
        return ResponseEntity.ok(ResponseObject
                .builder()
                .message("ok, Computer Name: " + computerName)
                .status(HttpStatus.OK)
                .build());
    }
}
