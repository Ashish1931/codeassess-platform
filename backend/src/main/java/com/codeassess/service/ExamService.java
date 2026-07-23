package com.codeassess.service;

import com.codeassess.dto.exam.ExamResultResponse;
import com.codeassess.dto.exam.ExamStartResponse;
import com.codeassess.dto.exam.ExamSubmissionRequest;

public interface ExamService {
    ExamStartResponse startExam(Long userId, Long testId);
    ExamResultResponse submitExam(Long userId, ExamSubmissionRequest request);
    ExamResultResponse getExamResultByAttemptId(Long attemptId, Long userId);
}
