package com.codeassess.service.impl;

import com.codeassess.dto.QuestionDto;
import com.codeassess.dto.exam.*;
import com.codeassess.entity.*;
import com.codeassess.enums.TestStatus;
import com.codeassess.exception.BadRequestException;
import com.codeassess.exception.ResourceNotFoundException;
import com.codeassess.repository.*;
import com.codeassess.service.ExamService;
import com.codeassess.service.QuestionService;
import com.codeassess.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final TestRepository testRepository;
    private final UserRepository userRepository;
    private final StudentAttemptRepository attemptRepository;
    private final StudentAnswerRepository answerRepository;
    private final ResultRepository resultRepository;
    private final QuestionRepository questionRepository;
    private final QuestionService questionService;
    private final SubscriptionService subscriptionService;

    @Override
    @Transactional
    public ExamStartResponse startExam(Long userId, Long testId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Test", "id", testId));

        if (test.getStatus() != TestStatus.PUBLISHED && test.getStatus() != TestStatus.RESULT_PUBLISHED) {
            throw new BadRequestException("This test is not currently available for attempts.");
        }

        User student = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        enforceSubscriptionLimit(userId);

        // Create new attempt
        StudentAttempt attempt = StudentAttempt.builder()
                .student(student)
                .test(test)
                .startTime(LocalDateTime.now())
                .isSubmitted(false)
                .build();

        StudentAttempt savedAttempt = attemptRepository.save(attempt);

        List<QuestionDto> questionDtos = questionService.getQuestionsByTest(testId, userId);

        return ExamStartResponse.builder()
                .attemptId(savedAttempt.getId())
                .testId(test.getId())
                .testTitle(test.getTitle())
                .subjectName(test.getSubject().getName())
                .durationMinutes(test.getDurationMinutes())
                .totalMarks(test.getTotalMarks())
                .passingMarks(test.getPassingMarks())
                .startTime(savedAttempt.getStartTime())
                .questions(questionDtos)
                .build();
    }

    @Override
    @Transactional
    public ExamResultResponse submitExam(Long userId, ExamSubmissionRequest request) {
        StudentAttempt attempt = attemptRepository.findById(request.getAttemptId())
                .orElseThrow(() -> new ResourceNotFoundException("StudentAttempt", "id", request.getAttemptId()));

        ensureAttemptOwner(attempt, userId);

        if (Boolean.TRUE.equals(attempt.getIsSubmitted())) {
            return getExamResultByAttemptId(attempt.getId(), userId);
        }

        attempt.setIsSubmitted(true);
        attempt.setEndTime(LocalDateTime.now());
        attempt.setTimeTakenSeconds(request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0);

        List<Question> questions = questionRepository.findByTestId(attempt.getTest().getId());
        Map<Long, Question> questionMap = questions.stream().collect(Collectors.toMap(Question::getId, q -> q));

        Map<Long, StudentAnswerDto> submissionMap = new HashMap<>();
        if (request.getAnswers() != null) {
            for (StudentAnswerDto ans : request.getAnswers()) {
                submissionMap.put(ans.getQuestionId(), ans);
            }
        }

        double totalScore = 0.0;
        int correctCount = 0;
        int wrongCount = 0;
        int unattemptedCount = 0;

        List<StudentAnswer> studentAnswers = new ArrayList<>();
        Map<String, int[]> topicStats = new HashMap<>(); // [total, correct]

        for (Question q : questions) {
            StudentAnswerDto ansDto = submissionMap.get(q.getId());
            String selected = ansDto != null ? ansDto.getSelectedAnswer() : null;
            boolean markedReview = ansDto != null && Boolean.TRUE.equals(ansDto.getIsMarkedForReview());

            boolean isCorrect = false;
            double marksObtained = 0.0;

            topicStats.computeIfAbsent(q.getTopic(), k -> new int[]{0, 0})[0]++;

            if (selected != null && !selected.trim().isEmpty()) {
                if (selected.equalsIgnoreCase(q.getCorrectAnswer())) {
                    isCorrect = true;
                    marksObtained = q.getMarks();
                    totalScore += marksObtained;
                    correctCount++;
                    topicStats.get(q.getTopic())[1]++;
                } else {
                    wrongCount++;
                }
            } else {
                unattemptedCount++;
            }

            StudentAnswer studentAnswer = StudentAnswer.builder()
                    .attempt(attempt)
                    .question(q)
                    .selectedAnswer(selected)
                    .isMarkedForReview(markedReview)
                    .isCorrect(isCorrect)
                    .marksObtained(marksObtained)
                    .build();

            studentAnswers.add(studentAnswer);
        }

        answerRepository.saveAll(studentAnswers);

        double maxScore = attempt.getTest().getTotalMarks();
        double percentage = maxScore > 0 ? (totalScore / maxScore) * 100.0 : 0.0;
        percentage = Math.round(percentage * 10.0) / 10.0;
        boolean isPassed = totalScore >= attempt.getTest().getPassingMarks();

        Result result = Result.builder()
                .attempt(attempt)
                .student(attempt.getStudent())
                .score(totalScore)
                .maxScore(maxScore)
                .percentage(percentage)
                .correctAnswersCount(correctCount)
                .wrongAnswersCount(wrongCount)
                .unattemptedCount(unattemptedCount)
                .isPassed(isPassed)
                .calculatedRank(1)
                .build();

        Result savedResult = resultRepository.save(result);
        attempt.setResult(savedResult);
        attemptRepository.save(attempt);

        return getExamResultByAttemptId(attempt.getId(), userId);
    }

    @Override
    public ExamResultResponse getExamResultByAttemptId(Long attemptId, Long userId) {
        StudentAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Attempt", "id", attemptId));

        ensureAttemptOwner(attempt, userId);

        Result result = resultRepository.findByAttemptId(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Result", "attemptId", attemptId));

        List<StudentAnswer> answers = answerRepository.findByAttemptId(attemptId);

        Map<String, int[]> topicStats = new HashMap<>();
        List<DetailedAnswerReviewDto> questionReviews = new ArrayList<>();

        for (StudentAnswer sa : answers) {
            Question q = sa.getQuestion();
            topicStats.computeIfAbsent(q.getTopic(), k -> new int[]{0, 0})[0]++;
            if (Boolean.TRUE.equals(sa.getIsCorrect())) {
                topicStats.get(q.getTopic())[1]++;
            }

            questionReviews.add(DetailedAnswerReviewDto.builder()
                    .questionId(q.getId())
                    .questionText(q.getQuestionText())
                    .codeSnippet(q.getCodeSnippet())
                    .topic(q.getTopic())
                    .selectedAnswer(sa.getSelectedAnswer())
                    .correctAnswer(q.getCorrectAnswer())
                    .isCorrect(sa.getIsCorrect())
                    .marksObtained(sa.getMarksObtained())
                    .explanation(q.getExplanation())
                    .options(questionService.getQuestionById(q.getId(), userId).getOptions())
                    .build());
        }

        List<TopicPerformanceDto> topicBreakdown = topicStats.entrySet().stream().map(entry -> {
            int total = entry.getValue()[0];
            int correct = entry.getValue()[1];
            double accuracy = total > 0 ? ((double) correct / total) * 100.0 : 0.0;
            return TopicPerformanceDto.builder()
                    .topic(entry.getKey())
                    .totalQuestions(total)
                    .correctCount(correct)
                    .accuracyPercentage(Math.round(accuracy * 10.0) / 10.0)
                    .build();
        }).collect(Collectors.toList());

        return ExamResultResponse.builder()
                .resultId(result.getId())
                .attemptId(attempt.getId())
                .testId(attempt.getTest().getId())
                .testTitle(attempt.getTest().getTitle())
                .subjectName(attempt.getTest().getSubject().getName())
                .studentName(attempt.getStudent().getFirstName() + " " + attempt.getStudent().getLastName())
                .studentEmail(attempt.getStudent().getEmail())
                .score(result.getScore())
                .maxScore(result.getMaxScore())
                .percentage(result.getPercentage())
                .correctAnswersCount(result.getCorrectAnswersCount())
                .wrongAnswersCount(result.getWrongAnswersCount())
                .unattemptedCount(result.getUnattemptedCount())
                .isPassed(result.getIsPassed())
                .timeTakenSeconds(attempt.getTimeTakenSeconds())
                .calculatedRank(result.getCalculatedRank())
                .completedAt(result.getCreatedAt())
                .topicBreakdown(topicBreakdown)
                .questionReviews(questionReviews)
                .build();
    }

    private void enforceSubscriptionLimit(Long userId) {
        Integer monthlyLimit = subscriptionService.getCurrentSubscription(userId).getMonthlyTestLimit();
        if (monthlyLimit == null || monthlyLimit < 0) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).toLocalDate().atStartOfDay();
        Long monthlyAttempts = attemptRepository.countByStudentIdAndStartTimeBetween(userId, startOfMonth, now);

        if (monthlyAttempts >= monthlyLimit) {
            throw new BadRequestException("Monthly test attempt limit reached. Please upgrade your subscription plan.");
        }
    }

    private void ensureAttemptOwner(StudentAttempt attempt, Long userId) {
        if (!attempt.getStudent().getId().equals(userId)) {
            throw new BadRequestException("You are not allowed to access this exam attempt.");
        }
    }
}
