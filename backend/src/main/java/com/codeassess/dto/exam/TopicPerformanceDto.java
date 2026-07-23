package com.codeassess.dto.exam;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopicPerformanceDto {
    private String topic;
    private Integer totalQuestions;
    private Integer correctCount;
    private Double accuracyPercentage;
}
