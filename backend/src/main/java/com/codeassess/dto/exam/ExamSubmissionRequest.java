package com.codeassess.dto.exam;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class ExamSubmissionRequest {

    @NotNull(message = "Attempt ID is required")
    private Long attemptId;

    private Integer timeTakenSeconds;

    private List<StudentAnswerDto> answers;
}
