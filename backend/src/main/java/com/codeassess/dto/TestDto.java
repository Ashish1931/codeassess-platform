package com.codeassess.dto;

import com.codeassess.enums.DifficultyLevel;
import com.codeassess.enums.TestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TestDto {
    private Long id;
    private Long subjectId;
    private String subjectName;
    private String title;
    private String description;
    private DifficultyLevel difficulty;
    private Integer durationMinutes;
    private Double totalMarks;
    private Double passingMarks;
    private TestStatus status;
    private Integer totalQuestions;
    private Boolean isAttempted;
    private Double lastScore;
}
