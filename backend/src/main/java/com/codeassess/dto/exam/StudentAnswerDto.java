package com.codeassess.dto.exam;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentAnswerDto {
    private Long questionId;
    private String selectedAnswer; // 'A', 'B', 'C', 'D' or null
    private Boolean isMarkedForReview;
}
