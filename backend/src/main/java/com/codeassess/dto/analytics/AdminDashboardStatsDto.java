package com.codeassess.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardStatsDto {
    private Long totalStudents;
    private Long totalSubjects;
    private Long totalTests;
    private Long todayAttempts;
    private Double averageScore;
    private Double highestScore;
    private Double lowestScore;
    private Long pendingResultsCount;
}
