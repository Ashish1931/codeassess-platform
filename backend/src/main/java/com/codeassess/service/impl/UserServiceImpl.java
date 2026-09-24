package com.codeassess.service.impl;

import com.codeassess.dto.analytics.DashboardStatsDto;
import com.codeassess.dto.user.*;
import com.codeassess.entity.Result;
import com.codeassess.entity.StudentAttempt;
import com.codeassess.entity.User;
import com.codeassess.enums.TestStatus;
import com.codeassess.exception.BadRequestException;
import com.codeassess.exception.ResourceNotFoundException;
import com.codeassess.repository.ResultRepository;
import com.codeassess.repository.StudentAttemptRepository;
import com.codeassess.repository.TestRepository;
import com.codeassess.repository.UserRepository;
import com.codeassess.service.SubscriptionService;
import com.codeassess.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TestRepository testRepository;
    private final StudentAttemptRepository attemptRepository;
    private final ResultRepository resultRepository;
    private final PasswordEncoder passwordEncoder;
    private final SubscriptionService subscriptionService;

    @Override
    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return UserProfileDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .subjectPreference(user.getSubjectPreference())
                .profilePictureUrl(user.getProfilePictureUrl())
                .subscription(subscriptionService.getCurrentSubscription(user.getId()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        String mobileNumber = request.getMobileNumber();
        if (!user.getMobileNumber().equals(mobileNumber) && userRepository.existsByMobileNumber(mobileNumber)) {
            throw new BadRequestException("Mobile Number is already registered");
        }

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setMobileNumber(mobileNumber.trim());
        user.setSubjectPreference(request.getSubjectPreference());
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }

        userRepository.save(user);

        return getUserProfile(userId);
    }

    @Override
    @Transactional
    public String changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current Password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BadRequestException("New Password and Confirm Password do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully!";
    }

    @Override
    public DashboardStatsDto getStudentDashboardStats(Long userId) {
        long totalTestsAvailable = testRepository.findByStatus(TestStatus.PUBLISHED).size();
        List<StudentAttempt> attempts = attemptRepository.findByStudentId(userId);
        long attemptedCount = attempts.stream().filter(StudentAttempt::getIsSubmitted).count();
        long pendingCount = Math.max(0, totalTestsAvailable - attemptedCount);

        List<Result> results = resultRepository.findByStudentId(userId);

        Double avgScore = resultRepository.findAveragePercentageByStudentId(userId);
        Double maxScore = resultRepository.findMaxPercentageByStudentId(userId);

        avgScore = avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0;
        maxScore = maxScore != null ? Math.round(maxScore * 10.0) / 10.0 : 0.0;

        String latestTestTitle = "N/A";
        Double latestTestScore = 0.0;

        if (!results.isEmpty()) {
            Result latest = results.get(results.size() - 1);
            latestTestTitle = latest.getAttempt().getTest().getTitle();
            latestTestScore = latest.getPercentage();
        }

        // Score Trend Over Time
        List<DashboardStatsDto.ScoreHistoryPoint> scoreHistory = results.stream().map(r ->
                new DashboardStatsDto.ScoreHistoryPoint(
                        r.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd")),
                        r.getPercentage(),
                        r.getAttempt().getTest().getTitle()
                )
        ).collect(Collectors.toList());

        // Subject Performance breakdown
        Map<String, List<Double>> subjectScores = new HashMap<>();
        for (Result r : results) {
            String subjectName = r.getAttempt().getTest().getSubject().getName();
            subjectScores.computeIfAbsent(subjectName, k -> new ArrayList<>()).add(r.getPercentage());
        }

        List<DashboardStatsDto.SubjectAccuracyPoint> subjectPerformance = new ArrayList<>();
        String weakSubject = "N/A";
        String strongSubject = "N/A";
        double minAvg = 101.0;
        double maxAvg = -1.0;

        for (Map.Entry<String, List<Double>> entry : subjectScores.entrySet()) {
            double subjectAvg = entry.getValue().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            subjectPerformance.add(new DashboardStatsDto.SubjectAccuracyPoint(
                    entry.getKey(),
                    Math.round(subjectAvg * 10.0) / 10.0,
                    entry.getValue().size()
            ));

            if (subjectAvg < minAvg) {
                minAvg = subjectAvg;
                weakSubject = entry.getKey();
            }
            if (subjectAvg > maxAvg) {
                maxAvg = subjectAvg;
                strongSubject = entry.getKey();
            }
        }

        return DashboardStatsDto.builder()
                .totalTestsAvailable(totalTestsAvailable)
                .attemptedTestsCount(attemptedCount)
                .pendingTestsCount(pendingCount)
                .averageScorePercentage(avgScore)
                .bestScorePercentage(maxScore)
                .weakSubject(weakSubject)
                .strongSubject(strongSubject)
                .latestTestTitle(latestTestTitle)
                .latestTestScore(latestTestScore)
                .overallAccuracy(avgScore)
                .scoreTrendOverTime(scoreHistory)
                .subjectPerformance(subjectPerformance)
                .weakTopics(List.of("Dynamic Programming", "Graph Traversal", "Pointers in C++"))
                .strongTopics(List.of("SQL Joins", "OOP Inheritance", "Operating System Threads"))
                .build();
    }
}
