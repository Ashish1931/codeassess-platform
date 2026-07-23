package com.codeassess.dto;

import com.codeassess.enums.DifficultyLevel;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class QuestionRequest {

    @NotNull(message = "Test ID is required")
    private Long testId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    private String codeSnippet;

    @NotNull(message = "Difficulty level is required")
    private DifficultyLevel difficulty;

    @NotNull(message = "Marks value is required")
    @Positive(message = "Marks must be positive")
    private Double marks;

    @NotBlank(message = "Topic is required")
    private String topic;

    @NotBlank(message = "Explanation is required")
    private String explanation;

    @NotBlank(message = "Correct answer (A, B, C, D) is required")
    @Pattern(regexp = "^[A-D]$", message = "Correct answer must be A, B, C, or D")
    private String correctAnswer;

    @NotEmpty(message = "Four options (A, B, C, D) are required")
    private List<QuestionOptionDto> options;
}
