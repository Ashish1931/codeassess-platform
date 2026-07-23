package com.codeassess.repository;

import com.codeassess.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByAttemptId(Long attemptId);

    @Query("SELECT sa FROM StudentAnswer sa JOIN sa.attempt a WHERE a.student.id = :studentId AND sa.isCorrect = false")
    List<StudentAnswer> findWrongAnswersByStudentId(@Param("studentId") Long studentId);
}
