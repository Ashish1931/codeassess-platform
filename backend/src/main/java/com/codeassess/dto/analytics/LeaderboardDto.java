package com.codeassess.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardDto {
    private Integer rank;
    private Long userId;
    private String studentName;
    private String profilePictureUrl;
    private Double totalScore;
    private Double averagePercentage;
    private Integer testsCompleted;
    private Integer badgeCount;
}
