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
import java.util.Arrays;
import java.util.List;
@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private SessionRepository sessionRepository;

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
}