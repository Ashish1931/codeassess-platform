package com.codeassess.service.impl;

import com.codeassess.dto.QuestionDto;
import com.codeassess.dto.QuestionOptionDto;
import com.codeassess.dto.QuestionRequest;
import com.codeassess.entity.*;
import com.codeassess.exception.ResourceNotFoundException;
import com.codeassess.repository.BookmarkRepository;
import com.codeassess.repository.QuestionRepository;
import com.codeassess.repository.TestRepository;
import com.codeassess.repository.UserRepository;
import com.codeassess.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;
    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;

    @Override
    public List<QuestionDto> getQuestionsByTest(Long testId, Long userId) {
        return questionRepository.findByTestId(testId).stream()
                .map(q -> mapToDto(q, userId))
                .collect(Collectors.toList());
    }

    @Override
    public QuestionDto getQuestionById(Long id, Long userId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
        return mapToDto(question, userId);
    }

    @Override
    @Transactional
    public QuestionDto createQuestion(QuestionRequest req) {
        Test test = testRepository.findById(req.getTestId())
                .orElseThrow(() -> new ResourceNotFoundException("Test", "id", req.getTestId()));

        Question question = Question.builder()
                .test(test)
                .questionText(req.getQuestionText())
                .codeSnippet(req.getCodeSnippet())
                .difficulty(req.getDifficulty())
                .marks(req.getMarks())
                .topic(req.getTopic())
                .explanation(req.getExplanation())
                .correctAnswer(req.getCorrectAnswer())
                .build();

        List<QuestionOption> options = req.getOptions().stream().map(optDto ->
                QuestionOption.builder()
                        .question(question)
                        .optionLabel(optDto.getOptionLabel())
                        .optionText(optDto.getOptionText())
                        .build()
        ).collect(Collectors.toList());

        question.setOptions(options);
        Question saved = questionRepository.save(question);
        return mapToDto(saved, null);
    }

    @Override
    @Transactional
    public QuestionDto updateQuestion(Long id, QuestionRequest req) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));

        Test test = testRepository.findById(req.getTestId())
                .orElseThrow(() -> new ResourceNotFoundException("Test", "id", req.getTestId()));

        question.setTest(test);
        question.setQuestionText(req.getQuestionText());
        question.setCodeSnippet(req.getCodeSnippet());
        question.setDifficulty(req.getDifficulty());
        question.setMarks(req.getMarks());
        question.setTopic(req.getTopic());
        question.setExplanation(req.getExplanation());
        question.setCorrectAnswer(req.getCorrectAnswer());

        question.getOptions().clear();
        for (QuestionOptionDto optDto : req.getOptions()) {
            question.getOptions().add(QuestionOption.builder()
                    .question(question)
                    .optionLabel(optDto.getOptionLabel())
                    .optionText(optDto.getOptionText())
                    .build());
        }

        Question updated = questionRepository.save(question);
        return mapToDto(updated, null);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", "id", id));
        questionRepository.delete(question);
    }

    @Override
    @Transactional
    public void toggleBookmark(Long userId, Long questionId) {
        if (bookmarkRepository.existsByUserIdAndQuestionId(userId, questionId)) {
            bookmarkRepository.deleteByUserIdAndQuestionId(userId, questionId);
        } else {
            User user = userRepository.findById(userId).orElseThrow();
            Question question = questionRepository.findById(questionId).orElseThrow();
            bookmarkRepository.save(Bookmark.builder().user(user).question(question).build());
        }
    }

    @Override
    public List<QuestionDto> getBookmarkedQuestions(Long userId) {
        return bookmarkRepository.findByUserId(userId).stream()
                .map(bm -> mapToDto(bm.getQuestion(), userId))
                .collect(Collectors.toList());
    }

    private QuestionDto mapToDto(Question q, Long userId) {
        boolean isBookmarked = false;
        if (userId != null) {
            isBookmarked = bookmarkRepository.existsByUserIdAndQuestionId(userId, q.getId());
        }

        List<QuestionOptionDto> options = q.getOptions().stream().map(opt ->
                QuestionOptionDto.builder()
                        .id(opt.getId())
                        .optionLabel(opt.getOptionLabel())
                        .optionText(opt.getOptionText())
                        .build()
        ).collect(Collectors.toList());

        return QuestionDto.builder()
                .id(q.getId())
                .testId(q.getTest().getId())
                .questionText(q.getQuestionText())
                .codeSnippet(q.getCodeSnippet())
                .difficulty(q.getDifficulty())
                .marks(q.getMarks())
                .topic(q.getTopic())
                .explanation(q.getExplanation())
                .correctAnswer(q.getCorrectAnswer())
                .options(options)
                .isBookmarked(isBookmarked)
                .build();
    }
}
