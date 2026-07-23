package com.codeassess.dto;

import com.codeassess.enums.DifficultyLevel;
import com.codeassess.enums.TestStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TestRequest {

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Difficulty level is required")
    private DifficultyLevel difficulty;

    @NotNull(message = "Duration in minutes is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    private Integer durationMinutes;

    @NotNull(message = "Total marks is required")
    @Positive(message = "Total marks must be positive")
    private Double totalMarks;

    @NotNull(message = "Passing marks is required")
    @Positive(message = "Passing marks must be positive")
    private Double passingMarks;

    private TestStatus status = TestStatus.DRAFT;
}
