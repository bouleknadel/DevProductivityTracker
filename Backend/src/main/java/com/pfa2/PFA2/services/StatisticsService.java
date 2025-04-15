package com.pfa2.PFA2.services;

import com.pfa2.PFA2.dto.CodingStatsDto;
import com.pfa2.PFA2.entitys.Session;
import com.pfa2.PFA2.repositories.SessionRepository;
import com.pfa2.PFA2.sec.entity.AppUser;
import com.pfa2.PFA2.sec.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class StatisticsService {
    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private AccountService accountService;

    private static final int DAILY_GOAL_MINUTES = 120; // Example goal: 2 hours

    public CodingStatsDto getCodingStatistics(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // Get sessions for today and yesterday
        List<Session> todaySessions = sessionRepository.findByUserAndStartTimeBetween(
                user,
                today.atStartOfDay(),
                today.atTime(23, 59, 59)
        );

        List<Session> yesterdaySessions = sessionRepository.findByUserAndStartTimeBetween(
                user,
                yesterday.atStartOfDay(),
                yesterday.atTime(23, 59, 59)
        );

        // Calculate statistics
        int totalCodingTimeToday = todaySessions.stream()
                .mapToInt(s -> s.getDuration() != null ? s.getDuration() : 0)
                .sum();

        int totalCodingTimeYesterday = yesterdaySessions.stream()
                .mapToInt(s -> s.getDuration() != null ? s.getDuration() : 0)
                .sum();

        int interruptionsToday = todaySessions.stream()
                .mapToInt(s -> s.getInterruptions() != null ? s.getInterruptions() : 0)
                .sum();

        int linesWrittenToday = todaySessions.stream()
                .mapToInt(s -> s.getLinesWritten() != null ? s.getLinesWritten() : 0)
                .sum();

        int errorsToday = todaySessions.stream()
                .mapToInt(s -> s.getErrors() != null ? s.getErrors() : 0)
                .sum();

        // Calculate trends
        String codingTimeTrend = calculateTrend(totalCodingTimeToday, totalCodingTimeYesterday, "min");
        String sessionsTrend = calculateTrend(todaySessions.size(), yesterdaySessions.size(), "");
        String productivityTrend = calculateProductivityTrend(user);
        String interruptionsTrend = calculateTrend(interruptionsToday,
                yesterdaySessions.stream().mapToInt(s -> s.getInterruptions() != null ? s.getInterruptions() : 0).sum(),
                "");
        String linesOfCodeTrend = calculateTrend(linesWrittenToday,
                yesterdaySessions.stream().mapToInt(s -> s.getLinesWritten() != null ? s.getLinesWritten() : 0).sum(),
                "min");
        String errorsTrend = calculateTrend(errorsToday,
                yesterdaySessions.stream().mapToInt(s -> s.getErrors() != null ? s.getErrors() : 0).sum(),
                "");

        // Calculate average focus time
        int averageFocus = todaySessions.isEmpty() ? 0 :
                (int) todaySessions.stream()
                        .mapToInt(s -> s.getDuration() != null ? s.getDuration() : 0)
                        .average()
                        .orElse(0);

        // Calculate productivity (simplified)
        int productivity = calculateProductivity(totalCodingTimeToday, interruptionsToday);

        // Check daily goal
        boolean goalAchieved = totalCodingTimeToday >= DAILY_GOAL_MINUTES;

        return new CodingStatsDto(
                formatTime(totalCodingTimeToday),
                codingTimeTrend,
                todaySessions.size(),
                sessionsTrend,
                productivity,
                productivityTrend,
                interruptionsToday,
                interruptionsTrend,
                averageFocus,
                linesWrittenToday,
                linesOfCodeTrend,
                errorsToday,
                errorsTrend,
                goalAchieved,
                goalAchieved ? "✔ Bravo ! Objectif journalier" : "Objectif non atteint"
        );
    }

    private String formatTime(int minutes) {
        int hours = minutes / 60;
        int mins = minutes % 60;
        return String.format("%dh %02dmin", hours, mins);
    }

    private String calculateTrend(int todayValue, int yesterdayValue, String unit) {
        int difference = todayValue - yesterdayValue;
        if (difference == 0) return "→ Stable";

        String direction = difference > 0 ? "↑" : "↓";
        String timeFrame = unit.isEmpty() ? "" : " Depuis hier";

        return String.format("%s%d%s%s",
                direction,
                Math.abs(difference),
                unit,
                timeFrame);
    }

    private String calculateProductivityTrend(AppUser user) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(today.getDayOfWeek().getValue() - 1);

        // Get this week's sessions
        List<Session> thisWeekSessions = sessionRepository.findByUserAndStartTimeBetween(
                user,
                weekStart.atStartOfDay(),
                today.atTime(23, 59, 59)
        );

        // Get last week's sessions
        List<Session> lastWeekSessions = sessionRepository.findByUserAndStartTimeBetween(
                user,
                weekStart.minusWeeks(1).atStartOfDay(),
                weekStart.minusDays(1).atTime(23, 59, 59)
        );

        // Calculate productivity for both weeks (simplified)
        int thisWeekProductivity = calculateWeeklyProductivity(thisWeekSessions);
        int lastWeekProductivity = calculateWeeklyProductivity(lastWeekSessions);

        int difference = thisWeekProductivity - lastWeekProductivity;
        if (difference == 0) return "→ Stable";

        String direction = difference > 0 ? "↑" : "↓";
        return String.format("%s+%d%% Cette semaine", direction, Math.abs(difference));
    }

    private int calculateWeeklyProductivity(List<Session> sessions) {
        if (sessions.isEmpty()) return 0;

        int totalTime = sessions.stream()
                .mapToInt(s -> s.getDuration() != null ? s.getDuration() : 0)
                .sum();

        int totalInterruptions = sessions.stream()
                .mapToInt(s -> s.getInterruptions() != null ? s.getInterruptions() : 0)
                .sum();

        return calculateProductivity(totalTime, totalInterruptions);
    }

    private int calculateProductivity(int totalTime, int interruptions) {
        if (totalTime == 0) return 0;

        // Simplified productivity calculation
        double productivity = 100 - ((double) interruptions * 5); // Each interruption reduces productivity by 5%
        return (int) Math.max(0, Math.min(100, productivity));
    }
}