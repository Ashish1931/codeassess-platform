package com.codeassess.service;

import com.codeassess.dto.analytics.DashboardStatsDto;
import com.codeassess.dto.user.*;

public interface UserService {
    UserProfileDto getUserProfile(Long userId);
    UserProfileDto updateProfile(Long userId, UpdateProfileRequest request);
    String changePassword(Long userId, ChangePasswordRequest request);
    DashboardStatsDto getStudentDashboardStats(Long userId);
}
