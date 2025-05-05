package com.pfa2.PFA2.ai;

import com.pfa2.PFA2.dto.CodingStatsDto;
import com.pfa2.PFA2.entitys.Session;
import com.pfa2.PFA2.services.SessionService;
import com.pfa2.PFA2.services.StatisticsService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class ChatController {
    @Autowired
    private StatisticsService statisticsService;
    @Autowired
    private SessionService sessionService;
    private final ChatClient chatClient;
    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }
    @PostMapping(value = "/correctCode")
    public ResponseEntity<Map<String, String>> correctCode(@RequestBody Map<String, String> request) {
        String codeToCorrect = request.get("code");
        String programmingLanguage = request.getOrDefault("language", "unknown");

        String systemMessage = "Tu es un expert en programmation spécialisé dans la correction de code. " +
                "Analyse le code fourni, identifie les erreurs ou problèmes de structure, " +
                "puis retourne UNIQUEMENT le code corrigé, sans aucune explication ni commentaire supplémentaire. " +
                "Ne pas inclure de balises de code markdown comme ```java ou ```. " +
                "Respecte l'indentation et la structure d'origine autant que possible tout en corrigeant les erreurs. " +
                "N'ajoute pas de classe conteneur ni d'éléments non présents dans le code original. " +
                "Retourne uniquement le code corrigé, rien d'autre.";

        String prompt = "Langage de programmation: " + programmingLanguage + "\n\nCode à corriger:\n" + codeToCorrect;

        String correctedCode = chatClient.prompt()
                .system(systemMessage)
                .user(prompt)
                .call()
                .content();

        Map<String, String> response = new HashMap<>();
        response.put("correctedCode", correctedCode);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/developer-query")
    public ResponseEntity<Map<String, String>> getDeveloperAssistance(
            @RequestBody Map<String, String> request,
            Principal principal) {

        // Récupérer la question de l'utilisateur
        String userQuestion = request.get("question");

        // Obtenir les statistiques de codage de l'utilisateur connecté
        CodingStatsDto stats = statisticsService.getCodingStatistics(principal);
        List<Session> sessions = sessionService.getAllSessions(principal);

        // Analyser les données utilisateur pour créer un contexte personnalisé
        String personalizationContext = analyzeUserData(stats, sessions);

        // Créer le message système pour l'assistant IA
        String systemMessage = "Tu es un assistant de développement intelligent qui aide les développeurs à améliorer " +
                "leur productivité et leurs compétences en programmation. " +
                "TRÈS IMPORTANT: " +
                "1. Réponds DIRECTEMENT à la question posée par l'utilisateur. " +
                "2. Pour les questions de correction ou d'explication de code, fournis uniquement la solution technique avec une brève explication. " +
                "3. Pour les questions sur la productivité, les interruptions, les habitudes de codage ou autres sujets similaires: " +
                "   - UTILISE TOUJOURS les données spécifiques de l'utilisateur fournies dans le contexte pour personnaliser ta réponse. " +
                "   - Base tes conseils sur les tendances, forces et faiblesses spécifiques de cet utilisateur. " +
                "   - Réfère-toi explicitement à ses performances (ex: 'Compte tenu de votre taux d'interruptions élevé de X...', 'Vu que votre temps moyen de focus est de X minutes...') " +
                "4. Utilise les données linguistiques pour personnaliser davantage (ex: 'Pour un développeur Java comme vous qui code principalement en matinée...') " +
                "5. Fournis des objectifs d'amélioration spécifiques basés sur les statistiques actuelles de l'utilisateur. " +
                "6. Ne mentionne jamais explicitement ce processus de personnalisation à l'utilisateur. " +
                "Fournis une réponse concise et utile en français qui semble naturellement personnalisée.";

        // Créer le message utilisateur avec le contexte des statistiques et les insights personnalisés
        String prompt =
                "Voici la liste des sessions de l'utilisateur dans la base de données :\n" +
                        formatSessions(sessions) + "\n\n" +
                        "Voici les statistiques de codage de l'utilisateur aujourd'hui :\n" +
                        "- Temps total de codage: " + stats.getCodingTime() + " (" + stats.getCodingTimeTrend() + ")\n" +
                        "- Nombre de sessions: " + stats.getSessionsToday() + " (" + stats.getSessionsTrend() + ")\n" +
                        "- Productivité: " + stats.getProductivityPercentage() + "% (" + stats.getProductivityTrend() + ")\n" +
                        "- Nombre d'interruptions: " + stats.getInterruptions() + " (" + stats.getInterruptionsTrend() + ")\n" +
                        "- Temps de focus moyen: " + stats.getAverageFocusMinutes() + " minutes\n" +
                        "- Lignes de code écrites: " + stats.getLinesOfCode() + " (" + stats.getLinesOfCodeTrend() + ")\n" +
                        "- Erreurs rencontrées: " + stats.getErrorsDetected() + " (" + stats.getErrorsTrend() + ")\n" +
                        "- Objectif quotidien: " + stats.getGoalMessage() + "\n\n" +
                        "CONTEXTE PERSONNALISÉ DE L'UTILISATEUR:\n" + personalizationContext + "\n\n" +
                        "Question de l'utilisateur: " + userQuestion;

        // Obtenir la réponse de l'assistant IA
        String assistantResponse = chatClient.prompt()
                .system(systemMessage)
                .user(prompt)
                .call()
                .content();

        // Préparer la réponse
        Map<String, String> response = new HashMap<>();
        response.put("answer", assistantResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * Analyse les données utilisateur pour extraire des insights personnalisés
     */
    private String analyzeUserData(CodingStatsDto stats, List<Session> sessions) {
        StringBuilder context = new StringBuilder();

        // Analyse des préférences de langage
        Map<String, Integer> languagePreferences = new HashMap<>();
        for (Session session : sessions) {
            if (session.getLanguage() != null) {
                String langName = session.getLanguage().getName();
                languagePreferences.put(langName,
                        languagePreferences.getOrDefault(langName, 0) + (session.getDuration() != null ? session.getDuration() : 0));
            }
        }

        // Déterminer le langage préféré
        String favoriteLanguage = "inconnu";
        int maxDuration = 0;
        for (Map.Entry<String, Integer> entry : languagePreferences.entrySet()) {
            if (entry.getValue() > maxDuration) {
                maxDuration = entry.getValue();
                favoriteLanguage = entry.getKey();
            }
        }
        context.append("Langage préféré: ").append(favoriteLanguage).append("\n");

        // Analyse des horaires de travail
        Map<Integer, Integer> hourDistribution = new HashMap<>();
        for (Session session : sessions) {
            if (session.getStartTime() != null) {
                int hour = session.getStartTime().getHour();
                hourDistribution.put(hour, hourDistribution.getOrDefault(hour, 0) + 1);
            }
        }

        // Déterminer la période préférée
        String preferredTimePeriod = determinePreferredTimePeriod(hourDistribution);
        context.append("Période préférée de codage: ").append(preferredTimePeriod).append("\n");

        // Analyse de la productivité
        if (stats.getAverageFocusMinutes() > 0) {
            String focusLevel = determineFocusLevel(stats.getAverageFocusMinutes());
            context.append("Niveau de concentration: ").append(focusLevel).append("\n");
        }

        // Analyse des interruptions
        if (stats.getInterruptions() > 0) {
            String interruptionLevel = determineInterruptionLevel(stats.getInterruptions(), stats.getCodingTime());
            context.append("Niveau d'interruptions: ").append(interruptionLevel).append("\n");
        }

        // Analyse des erreurs
        if (stats.getErrorsDetected() > 0 && stats.getLinesOfCode() > 0) {
            double errorRate = (double) stats.getErrorsDetected() / stats.getLinesOfCode();
            String errorLevel = determineErrorLevel(errorRate);
            context.append("Taux d'erreurs: ").append(errorLevel).append("\n");
        }

        // Analyse de la régularité des sessions
        int totalSessions = sessions.size();
        boolean isRegular = isRegularCoder(sessions);
        context.append("Régularité des sessions: ").append(isRegular ? "régulier" : "irrégulier").append("\n");
        context.append("Total des sessions enregistrées: ").append(totalSessions).append("\n");

        // Durée moyenne des sessions
        double avgSessionDuration = calculateAverageSessionDuration(sessions);
        context.append("Durée moyenne des sessions: ").append(String.format("%.1f", avgSessionDuration)).append(" minutes\n");

        return context.toString();
    }

    /**
     * Format les sessions pour une meilleure lisibilité
     */
    private String formatSessions(List<Session> sessions) {
        StringBuilder sb = new StringBuilder();

        // Limiter à 10 sessions récentes pour éviter une surcharge d'informations
        int limit = Math.min(sessions.size(), 10);
        for (int i = 0; i < limit; i++) {
            Session session = sessions.get(i);
            sb.append("Session #").append(session.getId())
                    .append(": Début=").append(formatDateTime(session.getStartTime()))
                    .append(", Durée=").append(session.getDuration()).append(" min")
                    .append(", Interruptions=").append(session.getInterruptions())
                    .append(", Lignes=").append(session.getLinesWritten())
                    .append(", Erreurs=").append(session.getErrors())
                    .append(", Langage=").append(session.getLanguage() != null ? session.getLanguage().getName() : "N/A")
                    .append("\n");
        }

        return sb.toString();
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "N/A";
        return dateTime.getHour() + "h" + dateTime.getMinute();
    }

    private String determinePreferredTimePeriod(Map<Integer, Integer> hourDistribution) {
        int morningCount = 0;  // 6-12
        int afternoonCount = 0;  // 12-18
        int eveningCount = 0;  // 18-22
        int nightCount = 0;    // 22-6

        for (Map.Entry<Integer, Integer> entry : hourDistribution.entrySet()) {
            int hour = entry.getKey();
            int count = entry.getValue();

            if (hour >= 6 && hour < 12) morningCount += count;
            else if (hour >= 12 && hour < 18) afternoonCount += count;
            else if (hour >= 18 && hour < 22) eveningCount += count;
            else nightCount += count;
        }

        int max = Math.max(Math.max(morningCount, afternoonCount), Math.max(eveningCount, nightCount));

        if (max == morningCount) return "matin";
        if (max == afternoonCount) return "après-midi";
        if (max == eveningCount) return "soirée";
        return "nuit";
    }

    private String determineFocusLevel(double avgFocusMinutes) {
        if (avgFocusMinutes < 15) return "très faible";
        if (avgFocusMinutes < 25) return "faible";
        if (avgFocusMinutes < 45) return "moyen";
        if (avgFocusMinutes < 60) return "bon";
        return "excellent";
    }

    private String determineInterruptionLevel(int interruptions, String codingTime) {
        // Extraire les heures du codingTime (supposons un format comme "2h 30min")
        double hours = 0;
        try {
            if (codingTime.contains("h")) {
                String[] parts = codingTime.split("h");
                hours = Double.parseDouble(parts[0].trim());
                if (parts.length > 1 && parts[1].contains("min")) {
                    hours += Double.parseDouble(parts[1].replace("min", "").trim()) / 60;
                }
            } else if (codingTime.contains("min")) {
                hours = Double.parseDouble(codingTime.replace("min", "").trim()) / 60;
            }
        } catch (Exception e) {
            // Fallback si le format n'est pas celui attendu
            hours = 1;
        }

        double interruptionsPerHour = interruptions / Math.max(hours, 0.1);

        if (interruptionsPerHour < 1) return "très faible";
        if (interruptionsPerHour < 3) return "faible";
        if (interruptionsPerHour < 6) return "moyen";
        if (interruptionsPerHour < 10) return "élevé";
        return "très élevé";
    }

    private String determineErrorLevel(double errorRate) {
        if (errorRate < 0.01) return "très faible";
        if (errorRate < 0.05) return "faible";
        if (errorRate < 0.1) return "moyen";
        if (errorRate < 0.2) return "élevé";
        return "très élevé";
    }

    private boolean isRegularCoder(List<Session> sessions) {
        if (sessions.size() < 3) return false;

        // Analyser les dates des dernières sessions pour voir si elles sont régulières
        // (cette implémentation simplifiée pourrait être améliorée)
        Map<Integer, Integer> dayOfWeekCounts = new HashMap<>();

        for (Session session : sessions) {
            if (session.getStartTime() != null) {
                int dayOfWeek = session.getStartTime().getDayOfWeek().getValue();
                dayOfWeekCounts.put(dayOfWeek, dayOfWeekCounts.getOrDefault(dayOfWeek, 0) + 1);
            }
        }

        // Si l'utilisateur code régulièrement certains jours de la semaine
        return dayOfWeekCounts.values().stream().anyMatch(count -> count > 2);
    }

    private double calculateAverageSessionDuration(List<Session> sessions) {
        if (sessions.isEmpty()) return 0;

        int totalDuration = 0;
        int validSessions = 0;

        for (Session session : sessions) {
            if (session.getDuration() != null && session.getDuration() > 0) {
                totalDuration += session.getDuration();
                validSessions++;
            }
        }

        return validSessions > 0 ? (double) totalDuration / validSessions : 0;
    }
    @PostMapping("/generate-code")
    public ResponseEntity<Map<String, String>> generateCode(
            @RequestBody Map<String, String> request,
            Principal principal) {

        String userPrompt = request.get("prompt");
        String programmingLanguage = request.getOrDefault("language", "Java");
        String framework = request.getOrDefault("framework", "");
        String complexity = request.getOrDefault("complexity", "medium");
        String fileContext = request.getOrDefault("fileContext", "");
        String modificationType = request.getOrDefault("modificationType", "add"); // Nouveau: add, replace, modify

        // Message système plus sophistiqué
        String systemMessage = "Tu es un assistant de génération de code. " +
                "Règles strictes:\n" +
                "1. Analyse le contexte existant avant de générer du code\n" +
                ". Analyse le contexte existant avant de générer du code\n" +
                "2. Si l'utilisateur demande une nouvelle fonctionnalité, ajoute-la au code existant\n" +
                "3. Si l'utilisateur demande de modifier une fonction existante, remplace-la\n" +
                "4. Si l'utilisateur demande une alternative, propose les deux versions\n" +
                "5. Conserve les imports et la structure globale\n" +
                "6. Formatte le code pour correspondre au style existant"+
                "7. donner le code seulment a ajouter et pas toute le code\n";

        String fullPrompt = "Contexte actuel:\n" + fileContext + "\n\n" +
                "Demande utilisateur:\n" + userPrompt + "\n\n" +
                "Type de modification demandée: " + modificationType + "\n" +
                "Langage: " + programmingLanguage +
                (framework.isEmpty() ? "" : "\nFramework: " + framework);

        // Appel à l'IA
        String generatedCode = chatClient.prompt()
                .system(systemMessage)
                .user(fullPrompt)
                .call()
                .content();

        // Nettoyer la réponse
        generatedCode = cleanGeneratedCode(generatedCode);

        Map<String, String> response = new HashMap<>();
        response.put("generatedCode", generatedCode);
        return ResponseEntity.ok(response);
    }
    private String cleanGeneratedCode(String code) {
        // Supprimer les blocs de code markdown si présents
        code = code.replaceAll("```[a-zA-Z]*", "");
        code = code.replaceAll("```", "");

        // Supprimer les mentions "Voici le code..." etc.
        code = code.replaceAll("(?i)here('s| is) .* code( you asked for)?:", "");
        code = code.replaceAll("(?i)generated code:", "");

        return code.trim();
    }
    @PostMapping("/generate-tests")
    public ResponseEntity<Map<String, String>> generateUnitTests(
            @RequestBody Map<String, String> request,
            Principal principal) {

        String code = request.get("code");
        String programmingLanguage = request.getOrDefault("language", "Java");
        String testFramework = request.getOrDefault("testFramework",
                programmingLanguage.equals("Java") ? "JUnit" :
                        programmingLanguage.equals("JavaScript") ? "Jest" : "");

        // Message système pour la génération de tests
        String systemMessage = "Tu es un expert en tests unitaires. " +
                "Règles strictes:\n" +
                "1. Génère des tests unitaires complets pour le code fourni\n" +
                "2. Utilise le framework de test: " + testFramework + "\n" +
                "3. Couvre tous les cas limites et cas d'utilisation\n" +
                "4. Inclue les assertions nécessaires\n" +
                "5. Structure les tests de manière logique\n" +
                "6. Ajoute des commentaires pour expliquer chaque test\n" +
                "7. Retourne uniquement le code des tests, sans explications supplémentaires\n" +
                "8. Formatte le code correctement avec une indentation propre";

        String prompt = "Code à tester:\n" + code + "\n\n" +
                "Langage: " + programmingLanguage + "\n" +
                "Framework de test: " + testFramework + "\n\n" +
                "Génère des tests unitaires complets pour ce code.";

        // Appel à l'IA
        String generatedTests = chatClient.prompt()
                .system(systemMessage)
                .user(prompt)
                .call()
                .content();

        // Nettoyer la réponse
        generatedTests = cleanGeneratedCode(generatedTests);

        Map<String, String> response = new HashMap<>();
        response.put("testCode", generatedTests);
        response.put("testFramework", testFramework);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/optimal-hours")
    public ResponseEntity<Map<String, String>> getOptimalHours(Principal principal) {
        List<Session> sessions = sessionService.getAllSessions(principal);

        // Analyser les heures avec le plus de sessions
        Map<Integer, Integer> hourCounts = new HashMap<>();
        for (Session session : sessions) {
            if (session.getStartTime() != null) {
                int hour = session.getStartTime().getHour();
                hourCounts.put(hour, hourCounts.getOrDefault(hour, 0) + 1);
            }
        }

        // Trouver les 3 heures les plus fréquentes
        List<Integer> topHours = hourCounts.entrySet().stream()
                .sorted(Map.Entry.<Integer, Integer>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Formater la réponse
        String optimalHours = topHours.stream()
                .sorted()
                .map(h -> String.format("%02dh-%02dh", h, h+1))
                .collect(Collectors.joining(", "));

        // Demander à l'IA de formuler une recommandation courte
        String prompt = "L'utilisateur code le plus souvent aux heures suivantes: " + optimalHours +
                ". Donne une seule phrase de recommandation en français pour ses heures de travail optimales.";

        String recommendation = chatClient.prompt()
                .system("Tu es un assistant de productivité. Donne des conseils courts et utiles.")
                .user(prompt)
                .call()
                .content();

        Map<String, String> response = new HashMap<>();
        response.put("optimalHours", optimalHours);
        response.put("recommendation", recommendation);

        return ResponseEntity.ok(response);
    }
}

