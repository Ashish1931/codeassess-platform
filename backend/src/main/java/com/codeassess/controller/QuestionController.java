package com.codeassess.controller;

import com.codeassess.config.security.UserPrincipal;
import com.codeassess.dto.QuestionDto;
import com.codeassess.dto.QuestionRequest;
import com.codeassess.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<QuestionDto>> getQuestionsByTest(@PathVariable Long testId,
                                                                 @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(questionService.getQuestionsByTest(testId, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDto> getQuestionById(@PathVariable Long id,
                                                         @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(questionService.getQuestionById(id, userId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionDto> createQuestion(@Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.createQuestion(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionDto> updateQuestion(@PathVariable Long id, @Valid @RequestBody QuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<String> toggleBookmark(@PathVariable Long id,
                                                 @AuthenticationPrincipal UserPrincipal userPrincipal) {
        questionService.toggleBookmark(userPrincipal.getId(), id);
        return ResponseEntity.ok("Bookmark toggled");
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<List<QuestionDto>> getBookmarks(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(questionService.getBookmarkedQuestions(userPrincipal.getId()));
    }
}
