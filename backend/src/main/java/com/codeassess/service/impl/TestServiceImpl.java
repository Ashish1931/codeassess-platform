package com.codeassess.service.impl;

import com.codeassess.dto.TestDto;
import com.codeassess.dto.TestRequest;
import com.codeassess.entity.Subject;
import com.codeassess.entity.Test;
import com.codeassess.enums.TestStatus;
import com.codeassess.exception.ResourceNotFoundException;
import com.codeassess.repository.QuestionRepository;
import com.codeassess.repository.ResultRepository;
import com.codeassess.repository.StudentAttemptRepository;
import com.codeassess.repository.SubjectRepository;
import com.codeassess.repository.TestRepository;
import com.codeassess.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {

    private final TestRepository testRepository;
    private final SubjectRepository subjectRepository;
    private final QuestionRepository questionRepository;
    private final StudentAttemptRepository attemptRepository;
    private final ResultRepository resultRepository;

    @Override
    public List<TestDto> getAllTests(Long userId) {
        return testRepository.findAll().stream()
                .map(t -> mapToDto(t, userId))
                .collect(Collectors.toList());
    }

    @Override
    public List<TestDto> getTestsBySubject(Long subjectId, Long userId) {
        return testRepository.findBySubjectId(subjectId).stream()
                .map(t -> mapToDto(t, userId))
                .collect(Collectors.toList());
    }

    @Override
    public TestDto getTestById(Long id, Long userId) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test", "id", id));
        return mapToDto(test, userId);
    }

    @Override
    @Transactional
    public TestDto createTest(TestRequest req) {
        Subject subject = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", req.getSubjectId()));

        Test test = Test.builder()
                .subject(subject)
                .title(req.getTitle())
                .description(req.getDescription())
                .difficulty(req.getDifficulty())
                .durationMinutes(req.getDurationMinutes())
                .totalMarks(req.getTotalMarks())
                .passingMarks(req.getPassingMarks())
                .status(req.getStatus() != null ? req.getStatus() : TestStatus.DRAFT)
                .build();

        Test saved = testRepository.save(test);
        return mapToDto(saved, null);
    }

    @Override
    @Transactional
    public TestDto updateTest(Long id, TestRequest req) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test", "id", id));

        Subject subject = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", req.getSubjectId()));

        test.setSubject(subject);
        test.setTitle(req.getTitle());
        test.setDescription(req.getDescription());
        test.setDifficulty(req.getDifficulty());
        test.setDurationMinutes(req.getDurationMinutes());
        test.setTotalMarks(req.getTotalMarks());
        test.setPassingMarks(req.getPassingMarks());
        if (req.getStatus() != null) {
            test.setStatus(req.getStatus());
        }

        Test updated = testRepository.save(test);
        return mapToDto(updated, null);
    }

    @Override
    @Transactional
    public TestDto updateTestStatus(Long id, TestStatus status) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test", "id", id));
        test.setStatus(status);
        Test updated = testRepository.save(test);
        return mapToDto(updated, null);
    }

    @Override
    @Transactional
    public void deleteTest(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test", "id", id));
        testRepository.delete(test);
    }

    private TestDto mapToDto(Test test, Long userId) {
        Long qCount = questionRepository.countByTestId(test.getId());
        boolean isAttempted = false;
        Double lastScore = null;

        if (userId != null) {
            var attempts = attemptRepository.findByStudentIdAndTestId(userId, test.getId());
            isAttempted = attempts.stream().anyMatch(a -> Boolean.TRUE.equals(a.getIsSubmitted()));
            if (isAttempted) {
                var attempt = attempts.stream().filter(a -> Boolean.TRUE.equals(a.getIsSubmitted())).findFirst().orElse(null);
                if (attempt != null && attempt.getResult() != null) {
                    lastScore = attempt.getResult().getPercentage();
                }
            }
        }

        return TestDto.builder()
                .id(test.getId())
                .subjectId(test.getSubject().getId())
                .subjectName(test.getSubject().getName())
                .title(test.getTitle())
                .description(test.getDescription())
                .difficulty(test.getDifficulty())
                .durationMinutes(test.getDurationMinutes())
                .totalMarks(test.getTotalMarks())
                .passingMarks(test.getPassingMarks())
                .status(test.getStatus())
                .totalQuestions(qCount.intValue())
                .isAttempted(isAttempted)
                .lastScore(lastScore)
                .build();
    }
}
