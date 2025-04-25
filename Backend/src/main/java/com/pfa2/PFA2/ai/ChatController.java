package com.pfa2.PFA2.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ChatController {
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
}