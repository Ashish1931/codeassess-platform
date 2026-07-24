package com.codeassess.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/", "/health", "/api/v1", "/api/v1/health"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "CodeAssess Platform REST API",
                "version", "1.0.0",
                "message", "Backend API is running smoothly!",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
