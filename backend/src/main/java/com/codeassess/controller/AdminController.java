package com.codeassess.controller;

import com.codeassess.dto.analytics.AdminDashboardStatsDto;
import com.codeassess.dto.user.UserProfileDto;
import com.codeassess.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getAdminDashboardStats());
    }

    @GetMapping("/students")
    public ResponseEntity<List<UserProfileDto>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }
}
