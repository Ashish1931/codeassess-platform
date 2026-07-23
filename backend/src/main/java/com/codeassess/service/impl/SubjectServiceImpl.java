package com.codeassess.service.impl;

import com.codeassess.dto.SubjectDto;
import com.codeassess.entity.Subject;
import com.codeassess.exception.BadRequestException;
import com.codeassess.exception.ResourceNotFoundException;
import com.codeassess.repository.SubjectRepository;
import com.codeassess.repository.TestRepository;
import com.codeassess.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final TestRepository testRepository;

    @Override
    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectDto getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
        return mapToDto(subject);
    }

    @Override
    @Transactional
    public SubjectDto createSubject(SubjectDto dto) {
        if (subjectRepository.existsByName(dto.getName())) {
            throw new BadRequestException("Subject with name '" + dto.getName() + "' already exists");
        }

        Subject subject = Subject.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .code(dto.getCode())
                .imageUrl(dto.getImageUrl())
                .build();

        Subject saved = subjectRepository.save(subject);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public SubjectDto updateSubject(Long id, SubjectDto dto) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));

        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        subject.setCode(dto.getCode());
        if (dto.getImageUrl() != null) {
            subject.setImageUrl(dto.getImageUrl());
        }

        Subject updated = subjectRepository.save(subject);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
        subjectRepository.delete(subject);
    }

    private SubjectDto mapToDto(Subject subject) {
        Long testCount = testRepository.countBySubjectId(subject.getId());
        return SubjectDto.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .code(subject.getCode())
                .imageUrl(subject.getImageUrl())
                .totalTests(testCount)
                .build();
    }
}
