package com.pfa2.PFA2.controllers;

import com.pfa2.PFA2.dto.CodingStatsDto;
import com.pfa2.PFA2.entitys.Session;
import com.pfa2.PFA2.repositories.SessionRepository;
import com.pfa2.PFA2.sec.entity.AppUser;
import com.pfa2.PFA2.sec.services.AccountService;
import com.pfa2.PFA2.services.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private SessionRepository sessionRepository;
    @GetMapping("/language-usage")
    public ResponseEntity<Map<String, Double>> getLanguageUsageStatistics(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        Map<String, Double> languageStats = statisticsService.getLanguageUsageStats(user);
        return ResponseEntity.ok(languageStats);
    }
    @GetMapping("/coding")
    public CodingStatsDto getCodingStatistics(Principal principal) {
        return statisticsService.getCodingStatistics(principal);
    }

    @GetMapping("/weeklysessions-java")
    public List<Integer> getWeeklySessionsJava(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<Session> sessions = sessionRepository.findByUserAndStartTimeBetween(
                user,
                startOfWeek.atStartOfDay(),
                endOfWeek.atTime(23, 59, 59)
        );

        // Debug: Afficher les sessions trouvées
        System.out.println("DEBUG - Sessions found: " + sessions.size());
        sessions.forEach(s -> System.out.println(
                "Session " + s.getId() + " at " + s.getStartTime()
        ));

        return countSessionsByDayJava(sessions);
    }

    private List<Integer> countSessionsByDayJava(List<Session> sessions) {
        int[] dailyCounts = new int[7]; // 0=Lundi à 6=Dimanche

        for (Session session : sessions) {
            try {
                DayOfWeek dayOfWeek = session.getStartTime().getDayOfWeek();
                // DayOfWeek: 1=Lundi, 2=Mardi,..., 7=Dimanche
                dailyCounts[dayOfWeek.getValue() - 1]++;
            } catch (Exception e) {
                System.err.println("ERROR processing session: " + session.getId());
                e.printStackTrace();
            }
        }

        // Debug: Afficher les comptages
        System.out.println("DEBUG - Daily counts:");
        System.out.println(Arrays.toString(dailyCounts));

        return Arrays.asList(
                dailyCounts[0], // Lundi
                dailyCounts[1], // Mardi
                dailyCounts[2], // Mercredi
                dailyCounts[3], // Jeudi
                dailyCounts[4], // Vendredi
                dailyCounts[5], // Samedi
                dailyCounts[6]  // Dimanche
        );
    }
    @GetMapping("/weeklyinterruptions")
    public List<Integer> getWeeklyInterruptions(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<Session> sessions = sessionRepository.findByUserAndStartTimeBetween(
                user,
                startOfWeek.atStartOfDay(),
                endOfWeek.atTime(23, 59, 59)
        );

        // Debug: Afficher les sessions trouvées
        System.out.println("DEBUG - Sessions found: " + sessions.size());
        sessions.forEach(s -> System.out.println(
                "Session " + s.getId() +
                        " at " + s.getStartTime() +
                        " with " + s.getInterruptions() + " interruptions"
        ));

        return countInterruptionsByDay(sessions);
    }

    private List<Integer> countInterruptionsByDay(List<Session> sessions) {
        int[] dailyInterruptions = new int[7]; // 0=Lundi à 6=Dimanche

        for (Session session : sessions) {
            try {
                DayOfWeek dayOfWeek = session.getStartTime().getDayOfWeek();
                // DayOfWeek: 1=Lundi, 2=Mardi,..., 7=Dimanche
                int interruptions = session.getInterruptions() != null ? session.getInterruptions() : 0;
                dailyInterruptions[dayOfWeek.getValue() - 1] += interruptions;
            } catch (Exception e) {
                System.err.println("ERROR processing session: " + session.getId());
                e.printStackTrace();
            }
        }

        // Debug: Afficher les interruptions par jour
        System.out.println("DEBUG - Daily interruptions:");
        System.out.println(Arrays.toString(dailyInterruptions));

        return Arrays.asList(
                dailyInterruptions[0], // Lundi
                dailyInterruptions[1], // Mardi
                dailyInterruptions[2], // Mercredi
                dailyInterruptions[3], // Jeudi
                dailyInterruptions[4], // Vendredi
                dailyInterruptions[5], // Samedi
                dailyInterruptions[6]  // Dimanche
        );
    }
    // Endpoint pour les heures mensuelles (janvier à août)
    @GetMapping("/monthly-coding-hours")
    public ResponseEntity<List<Double>> getMonthlyCodingHours(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        List<Double> monthlyHours = calculateMonthlyCodingHours(user);
        return ResponseEntity.ok(monthlyHours);
    }

    // Endpoint pour les heures hebdomadaires (lundi à dimanche)
    @GetMapping("/weekly-coding-hours")
    public ResponseEntity<List<Double>> getWeeklyCodingHours(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        List<Double> weeklyHours = calculateWeeklyCodingHours(user);
        return ResponseEntity.ok(weeklyHours);
    }

    private List<Double> calculateMonthlyCodingHours(AppUser user) {
        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        double[] monthlyHours = new double[8]; // janvier (0) à août (7)

        for (int month = 1; month <= 8; month++) {
            LocalDate startDate = LocalDate.of(currentYear, month, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

            List<Session> sessions = sessionRepository.findByUserAndStartTimeBetween(
                    user,
                    startDate.atStartOfDay(),
                    endDate.atTime(23, 59, 59)
            );

            double totalHours = sessions.stream()
                    .filter(s -> s.getDuration() != null)
                    .mapToDouble(s -> s.getDuration() / 60.0) // convertir minutes en heures
                    .sum();

            monthlyHours[month - 1] = Math.round(totalHours * 10) / 10.0; // arrondir à 1 décimale
        }

        return Arrays.asList(
                monthlyHours[0], monthlyHours[1], monthlyHours[2], monthlyHours[3],
                monthlyHours[4], monthlyHours[5], monthlyHours[6], monthlyHours[7]
        );
    }

    private List<Double> calculateWeeklyCodingHours(AppUser user) {
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(DayOfWeek.MONDAY);
        double[] dailyHours = new double[7]; // lundi (0) à dimanche (6)

        for (int i = 0; i < 7; i++) {
            LocalDate day = monday.plusDays(i);
            List<Session> sessions = sessionRepository.findByUserAndStartTimeBetween(
                    user,
                    day.atStartOfDay(),
                    day.atTime(23, 59, 59)
            );

            double totalHours = sessions.stream()
                    .filter(s -> s.getDuration() != null)
                    .mapToDouble(s -> s.getDuration() / 60.0) // convertir minutes en heures
                    .sum();

            dailyHours[i] = Math.round(totalHours * 10) / 10.0; // arrondir à 1 décimale
        }

        return Arrays.asList(
                dailyHours[0], dailyHours[1], dailyHours[2], dailyHours[3],
                dailyHours[4], dailyHours[5], dailyHours[6]
        );
    }
    @GetMapping("/session-duration-stats")
    public ResponseEntity<List<Integer>> getSessionDurationStats(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        List<Integer> stats = calculateSessionDurationStats(user);
        return ResponseEntity.ok(stats);
    }

    private List<Integer> calculateSessionDurationStats(AppUser user) {
        // Récupérer toutes les sessions de l'utilisateur
        List<Session> sessions = sessionRepository.findByUser(user);

        int shortSessions = 0;    // < 30 min
        int mediumSessions = 0;   // 30 min - 1h
        int longSessions = 0;     // > 1h

        for (Session session : sessions) {
            if (session.getDuration() != null) {
                if (session.getDuration() < 30) {
                    shortSessions++;
                } else if (session.getDuration() <= 60) {
                    mediumSessions++;
                } else {
                    longSessions++;
                }
            }
        }

        return Arrays.asList(shortSessions, mediumSessions, longSessions);
    }
    @GetMapping("/concentration-data")
    public ResponseEntity<List<Integer>> get24hConcentrationData(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());
        List<Integer> concentrationData = calculate24hConcentration(user);
        return ResponseEntity.ok(concentrationData);
    }

    private List<Integer> calculate24hConcentration(AppUser user) {
        // Initialiser les 12 tranches de 2h
        int[] timeSlots = new int[12];
        int[] sessionCounts = new int[12];

        // Récupérer toutes les sessions
        List<Session> sessions = sessionRepository.findByUser(user);

        for (Session session : sessions) {
            if (session.getStartTime() != null) {
                int hour = session.getStartTime().getHour();
                // Déterminer la tranche (0-11)
                int slotIndex = hour / 2;

                // Calculer le score de concentration
                int score = calculateConcentrationScore(session);
                timeSlots[slotIndex] += score;
                sessionCounts[slotIndex]++;
            }
        }

        // Calculer la moyenne par tranche
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            result.add(sessionCounts[i] > 0 ? timeSlots[i] / sessionCounts[i] : 0);
        }

        return result;
    }

    private int calculateConcentrationScore(Session session) {
        // Score basé sur la durée (0-10)
        int durationScore = 0;
        if (session.getDuration() != null) {
            durationScore = (int) Math.min(10, session.getDuration() / 6.0);
        }

        // Réduction basée sur les interruptions
        int interruptionPenalty = 0;
        if (session.getInterruptions() != null) {
            interruptionPenalty = Math.min(5, session.getInterruptions());
        }

        return Math.max(1, durationScore - interruptionPenalty);
    }
    @GetMapping("/daily-code-stats")
    public ResponseEntity<Map<String, List<Integer>>> getDailyCodeStats(Principal principal) {
        AppUser user = accountService.loadUserByUsername(principal.getName());

        Map<String, List<Integer>> result = new HashMap<>();
        result.put("lines", getWeeklyLinesWritten(user));
        result.put("errors", getWeeklyErrors(user));

        return ResponseEntity.ok(result);
    }

    private List<Integer> getWeeklyLinesWritten(AppUser user) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        int[] dailyLines = new int[7]; // 0=Lundi à 6=Dimanche

        for (int i = 0; i < 7; i++) {
            LocalDate day = startOfWeek.plusDays(i);
            List<Session> sessions = sessionRepository.findByUserAndStartTimeBetween(
                    user,
                    day.atStartOfDay(),
                    day.atTime(23, 59, 59)
            );

            dailyLines[i] = sessions.stream()
                    .mapToInt(s -> s.getLinesWritten() != null ? s.getLinesWritten() : 0)
                    .sum();
        }

        return Arrays.asList(
                dailyLines[0], dailyLines[1], dailyLines[2],
                dailyLines[3], dailyLines[4], dailyLines[5], dailyLines[6]
        );
    }

    private List<Integer> getWeeklyErrors(AppUser user) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        int[] dailyErrors = new int[7]; // 0=Lundi à 6=Dimanche

        for (int i = 0; i < 7; i++) {
            LocalDate day = startOfWeek.plusDays(i);
            List<Session> sessions = sessionRepository.findByUserAndStartTimeBetween(
                    user,
                    day.atStartOfDay(),
                    day.atTime(23, 59, 59)
            );

            dailyErrors[i] = sessions.stream()
                    .mapToInt(s -> s.getErrors() != null ? s.getErrors() : 0)
                    .sum();
        }

        return Arrays.asList(
                dailyErrors[0], dailyErrors[1], dailyErrors[2],
                dailyErrors[3], dailyErrors[4], dailyErrors[5], dailyErrors[6]
        );
    }
}