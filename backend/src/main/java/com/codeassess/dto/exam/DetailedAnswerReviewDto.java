package com.codeassess.dto.exam;

import com.codeassess.dto.QuestionOptionDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DetailedAnswerReviewDto {
    private Long questionId;
    private String questionText;
    private String codeSnippet;
    private String topic;
    private String selectedAnswer;
    private String correctAnswer;
    private Boolean isCorrect;
    private Double marksObtained;
    private String explanation;
    private List<QuestionOptionDto> options;
}
