package com.codeassess.service.impl;

import com.codeassess.dto.analytics.AdminDashboardStatsDto;
import com.codeassess.dto.user.UserProfileDto;
import com.codeassess.entity.User;
import com.codeassess.repository.*;
import com.codeassess.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final TestRepository testRepository;
    private final StudentAttemptRepository attemptRepository;
    private final ResultRepository resultRepository;

    @Override
    public AdminDashboardStatsDto getAdminDashboardStats() {
        Long totalStudents = userRepository.countStudents();
        Long totalSubjects = subjectRepository.count();
        Long totalTests = testRepository.count();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        Long todayAttempts = attemptRepository.countAttemptsToday(startOfDay);

        Double avgScore = resultRepository.findGlobalAverageScore();
        Double highestScore = resultRepository.findGlobalHighestScore();
        Double lowestScore = resultRepository.findGlobalLowestScore();

        avgScore = avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0;
        highestScore = highestScore != null ? Math.round(highestScore * 10.0) / 10.0 : 0.0;
        lowestScore = lowestScore != null ? Math.round(lowestScore * 10.0) / 10.0 : 0.0;

        return AdminDashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalSubjects(totalSubjects)
                .totalTests(totalTests)
                .todayAttempts(todayAttempts)
                .averageScore(avgScore)
                .highestScore(highestScore)
                .lowestScore(lowestScore)
                .pendingResultsCount(0L)
                .build();
    }

    @Override
    public List<UserProfileDto> getAllStudents() {
        return userRepository.findAllStudents().stream().map(user ->
                UserProfileDto.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .mobileNumber(user.getMobileNumber())
                        .subjectPreference(user.getSubjectPreference())
                        .profilePictureUrl(user.getProfilePictureUrl())
                        .createdAt(user.getCreatedAt())
                        .build()
        ).collect(Collectors.toList());
    }

    @Override
    public void toggleStudentStatus(Long studentId) {
        // Method stub for administrative locking/unlocking of student profiles
    }
}
