package com.codeassess.controller;

import com.codeassess.dto.analytics.LeaderboardDto;
import com.codeassess.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/v1/leaderboard", "/leaderboard"})
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardDto>> getGlobalLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard());
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<LeaderboardDto>> getTestLeaderboard(@PathVariable Long testId) {
        return ResponseEntity.ok(leaderboardService.getTestLeaderboard(testId));
    }
}
