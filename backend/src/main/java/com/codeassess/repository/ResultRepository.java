package com.codeassess.repository;

import com.codeassess.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    Optional<Result> findByAttemptId(Long attemptId);

    @Query("SELECT r FROM Result r JOIN r.attempt a JOIN a.test t WHERE t.id = :testId ORDER BY r.score DESC, a.timeTakenSeconds ASC")
    List<Result> findLeaderboardForTest(@Param("testId") Long testId);

    @Query("SELECT AVG(r.percentage) FROM Result r WHERE r.student.id = :studentId")
    Double findAveragePercentageByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT MAX(r.percentage) FROM Result r WHERE r.student.id = :studentId")
    Double findMaxPercentageByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT AVG(r.score) FROM Result r")
    Double findGlobalAverageScore();

    @Query("SELECT MAX(r.score) FROM Result r")
    Double findGlobalHighestScore();

    @Query("SELECT MIN(r.score) FROM Result r")
    Double findGlobalLowestScore();
}
