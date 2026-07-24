package com.codeassess.controller;

import com.codeassess.config.security.UserPrincipal;
import com.codeassess.dto.exam.*;
import com.codeassess.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/exams", "/exams"})
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping("/start/{testId}")
    public ResponseEntity<ExamStartResponse> startExam(@PathVariable Long testId,
                                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(examService.startExam(userPrincipal.getId(), testId));
    }

    @PostMapping("/submit")
    public ResponseEntity<ExamResultResponse> submitExam(@Valid @RequestBody ExamSubmissionRequest request,
                                                         @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(examService.submitExam(userPrincipal.getId(), request));
    }

    @GetMapping("/result/{attemptId}")
    public ResponseEntity<ExamResultResponse> getResult(@PathVariable Long attemptId,
                                                         @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(examService.getExamResultByAttemptId(attemptId, userPrincipal.getId()));
    }
}
