package com.codeassess.repository;

import com.codeassess.entity.Test;
import com.codeassess.enums.TestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findBySubjectId(Long subjectId);
    List<Test> findByStatus(TestStatus status);
    List<Test> findBySubjectIdAndStatus(Long subjectId, TestStatus status);
    Long countBySubjectId(Long subjectId);
}
