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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        List<Session> session=sessionService.getAllSessions(principal);
        // Créer le message système pour l'assistant IA
        String systemMessage = "Tu es un assistant de développement intelligent qui aide les développeurs à améliorer " +
                "leur productivité et leurs compétences en programmation. " +
                "TRÈS IMPORTANT: " +
                "1. Réponds DIRECTEMENT à la question posée par l'utilisateur. " +
                "2. Pour les questions de correction ou d'explication de code, fournis uniquement la solution technique avec une brève explication. " +
                "3. Pour les questions sur la productivité, les interruptions, les habitudes de codage ou autres sujets similaires: " +
                "   - Si tu trouves l'information dans les données fournies, utilise-la pour personnaliser ta réponse. " +
                "   - Si l'information n'est pas disponible dans les données, fournis quand même une réponse utile basée sur les meilleures pratiques générales. " +
                "      Par exemple, pour la durée optimale d'une session, tu peux suggérer 25-90 minutes selon la technique Pomodoro ou d'autres méthodes reconnues. " +
                "      Pour les interruptions, tu peux suggérer des causes courantes et des solutions, même si tu ne connais pas les causes spécifiques de cet utilisateur. " +
                "4. Ne jamais dire 'Les données ne contiennent pas cette information' ou 'Je ne peux pas répondre'. Donne toujours une réponse constructive. " +
                "5. Si pertinent, tu peux brièvement mentionner comment les statistiques de l'utilisateur se comparent aux recommandations que tu fais. " +
                "Fournis une réponse concise et utile en français.";

        // Créer le message utilisateur avec le contexte des statistiques
        String prompt =
                "Voici la liste des session de utilisateur dans la bdd :\n" +
                        session+"\n"+
                "Voici les statistiques de codage de l'utilisateur aujourd'hui :\n" +
                "- Temps total de codage: " + stats.getCodingTime() + " (" + stats.getCodingTimeTrend() + ")\n" +
                "- Nombre de sessions: " + stats.getSessionsToday() + " (" + stats.getSessionsTrend() + ")\n" +
                "- Productivité: " + stats.getProductivityPercentage() + "% (" + stats.getProductivityTrend() + ")\n" +
                "- Nombre d'interruptions: " + stats.getInterruptions() + " (" + stats.getInterruptionsTrend() + ")\n" +
                "- Temps de focus moyen: " + stats.getAverageFocusMinutes() + " minutes\n" +
                "- Lignes de code écrites: " + stats.getLinesOfCode() + " (" + stats.getLinesOfCodeTrend() + ")\n" +
                "- Erreurs rencontrées: " + stats.getErrorsDetected() + " (" + stats.getErrorsTrend() + ")\n" +
                "- Objectif quotidien: " + stats.getGoalMessage() + "\n\n" +
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
}