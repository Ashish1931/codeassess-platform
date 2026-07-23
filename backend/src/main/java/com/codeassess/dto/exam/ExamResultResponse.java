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
public class ExamResultResponse {
    private Long resultId;
    private Long attemptId;
    private Long testId;
    private String testTitle;
    private String subjectName;
    private String studentName;
    private String studentEmail;
    private Double score;
    private Double maxScore;
    private Double percentage;
    private Integer correctAnswersCount;
    private Integer wrongAnswersCount;
    private Integer unattemptedCount;
    private Boolean isPassed;
    private Integer timeTakenSeconds;
    private Integer calculatedRank;
    private LocalDateTime completedAt;
    private List<TopicPerformanceDto> topicBreakdown;
    private List<DetailedAnswerReviewDto> questionReviews;
}
