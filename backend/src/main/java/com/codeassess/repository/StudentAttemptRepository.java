package com.codeassess.repository;

import com.codeassess.entity.StudentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAttemptRepository extends JpaRepository<StudentAttempt, Long> {
    List<StudentAttempt> findByStudentId(Long studentId);
    List<StudentAttempt> findByStudentIdAndTestId(Long studentId, Long testId);
    Optional<StudentAttempt> findByStudentIdAndTestIdAndIsSubmittedFalse(Long studentId, Long testId);
    Long countByStudentIdAndIsSubmittedTrue(Long studentId);

    @Query("SELECT COUNT(sa) FROM StudentAttempt sa WHERE sa.startTime >= :startOfDay")
    Long countAttemptsToday(@Param("startOfDay") LocalDateTime startOfDay);
}
