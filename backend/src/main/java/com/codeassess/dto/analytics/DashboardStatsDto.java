package com.codeassess.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private Long totalTestsAvailable;
    private Long attemptedTestsCount;
    private Long pendingTestsCount;
    private Double averageScorePercentage;
    private Double bestScorePercentage;
    private String weakSubject;
    private String strongSubject;
    private String latestTestTitle;
    private Double latestTestScore;
    private Double overallAccuracy;
    
    // Performance arrays for Charts
    private List<ScoreHistoryPoint> scoreTrendOverTime;
    private List<SubjectAccuracyPoint> subjectPerformance;
    private List<String> weakTopics;
    private List<String> strongTopics;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ScoreHistoryPoint {
        private String date;
        private Double scorePercentage;
        private String testTitle;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SubjectAccuracyPoint {
        private String subjectName;
        private Double accuracyPercentage;
        private Integer totalAttempted;
    }
}
