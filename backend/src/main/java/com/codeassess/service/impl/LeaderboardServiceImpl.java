package com.codeassess.service.impl;

import com.codeassess.dto.analytics.LeaderboardDto;
import com.codeassess.entity.Result;
import com.codeassess.entity.User;
import com.codeassess.repository.ResultRepository;
import com.codeassess.repository.UserRepository;
import com.codeassess.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;

    @Override
    public List<LeaderboardDto> getGlobalLeaderboard() {
        List<User> students = userRepository.findAllStudents();
        List<LeaderboardDto> leaderboard = new ArrayList<>();

        for (User student : students) {
            List<Result> results = resultRepository.findByStudentId(student.getId());
            if (results.isEmpty()) continue;

            double totalScore = results.stream().mapToDouble(Result::getScore).sum();
            double avgPercentage = results.stream().mapToDouble(Result::getPercentage).average().orElse(0.0);

            leaderboard.add(LeaderboardDto.builder()
                    .userId(student.getId())
                    .studentName(student.getFirstName() + " " + student.getLastName())
                    .profilePictureUrl(student.getProfilePictureUrl())
                    .totalScore(Math.round(totalScore * 10.0) / 10.0)
                    .averagePercentage(Math.round(avgPercentage * 10.0) / 10.0)
                    .testsCompleted(results.size())
                    .badgeCount((int) (results.size() / 2) + 1)
                    .build());
        }

        leaderboard.sort((a, b) -> Double.compare(b.getTotalScore(), a.getTotalScore()));

        for (int i = 0; i < leaderboard.size(); i++) {
            leaderboard.get(i).setRank(i + 1);
        }

        return leaderboard;
    }

    @Override
    public List<LeaderboardDto> getTestLeaderboard(Long testId) {
        List<Result> results = resultRepository.findLeaderboardForTest(testId);
        List<LeaderboardDto> leaderboard = new ArrayList<>();

        int rank = 1;
        for (Result r : results) {
            User student = r.getStudent();
            leaderboard.add(LeaderboardDto.builder()
                    .rank(rank++)
                    .userId(student.getId())
                    .studentName(student.getFirstName() + " " + student.getLastName())
                    .profilePictureUrl(student.getProfilePictureUrl())
                    .totalScore(r.getScore())
                    .averagePercentage(r.getPercentage())
                    .testsCompleted(1)
                    .badgeCount(1)
                    .build());
        }

        return leaderboard;
    }
}
