package com.codeassess.dto;

import com.codeassess.enums.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDto {
    private Long id;
    private Long testId;
    private String questionText;
    private String codeSnippet;
    private DifficultyLevel difficulty;
    private Double marks;
    private String topic;
    private String explanation;
    private String correctAnswer;
    private List<QuestionOptionDto> options;
    private Boolean isBookmarked;
}
