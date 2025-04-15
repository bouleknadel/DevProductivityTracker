package com.pfa2.PFA2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodingStatsDto {
    private String codingTime; // e.g. "2h 35min"
    private String codingTimeTrend; // e.g. "1-12min Depuis hier"
    private Integer sessionsToday;
    private String sessionsTrend; // e.g. "↓-1 Par rapport à hier"
    private Integer productivityPercentage;
    private String productivityTrend; // e.g. "↑+5% Cette semaine"
    private Integer interruptions;
    private String interruptionsTrend; // e.g. "↑+2 Aujourd'hui"
    private Integer averageFocusMinutes;
    private Integer linesOfCode;
    private String linesOfCodeTrend; // e.g. "↑+3min Moyenne journalière"
    private Integer errorsDetected;
    private String errorsTrend; // e.g. "↑+2 Depuis hier"
    private boolean dailyGoalAchieved;
    private String goalMessage; // e.g. "✔ Bravo ! Objectif journalier"
}