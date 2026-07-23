package com.codeassess.service;

import com.codeassess.dto.TestDto;
import com.codeassess.dto.TestRequest;
import com.codeassess.enums.TestStatus;
import java.util.List;

public interface TestService {
    List<TestDto> getAllTests(Long userId);
    List<TestDto> getTestsBySubject(Long subjectId, Long userId);
    TestDto getTestById(Long id, Long userId);
    TestDto createTest(TestRequest testRequest);
    TestDto updateTest(Long id, TestRequest testRequest);
    TestDto updateTestStatus(Long id, TestStatus status);
    void deleteTest(Long id);
}
