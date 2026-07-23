package com.codeassess.service;

import com.codeassess.dto.QuestionDto;
import com.codeassess.dto.QuestionRequest;
import java.util.List;

public interface QuestionService {
    List<QuestionDto> getQuestionsByTest(Long testId, Long userId);
    QuestionDto getQuestionById(Long id, Long userId);
    QuestionDto createQuestion(QuestionRequest request);
    QuestionDto updateQuestion(Long id, QuestionRequest request);
    void deleteQuestion(Long id);
    void toggleBookmark(Long userId, Long questionId);
    List<QuestionDto> getBookmarkedQuestions(Long userId);
}
