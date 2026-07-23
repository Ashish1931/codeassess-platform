package com.codeassess.service;

import com.codeassess.dto.analytics.AdminDashboardStatsDto;
import com.codeassess.dto.user.UserProfileDto;
import java.util.List;

public interface AdminService {
    AdminDashboardStatsDto getAdminDashboardStats();
    List<UserProfileDto> getAllStudents();
    void toggleStudentStatus(Long studentId);
}
