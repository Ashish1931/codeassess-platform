package com.codeassess.dto.exam;

import com.codeassess.dto.QuestionDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExamStartResponse {
    private Long attemptId;
    private Long testId;
    private String testTitle;
    private String subjectName;
    private Integer durationMinutes;
    private Double totalMarks;
    private Double passingMarks;
    private LocalDateTime startTime;
    private List<QuestionDto> questions;
}
