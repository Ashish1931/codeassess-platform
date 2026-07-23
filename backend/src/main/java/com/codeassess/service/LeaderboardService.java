package com.codeassess.service;

import com.codeassess.dto.analytics.LeaderboardDto;
import java.util.List;

public interface LeaderboardService {
    List<LeaderboardDto> getGlobalLeaderboard();
    List<LeaderboardDto> getTestLeaderboard(Long testId);
}
