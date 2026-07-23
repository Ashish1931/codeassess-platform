package com.codeassess.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionOptionDto {
    private Long id;
    private String optionLabel; // 'A', 'B', 'C', 'D'
    private String optionText;
}
