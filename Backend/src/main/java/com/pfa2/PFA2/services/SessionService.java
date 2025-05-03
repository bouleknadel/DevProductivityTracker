package com.pfa2.PFA2.services;

import com.pfa2.PFA2.dto.SessionUpdateDto;
import com.pfa2.PFA2.entitys.Language;
import com.pfa2.PFA2.entitys.Session;
import com.pfa2.PFA2.repositories.LanguageRepository;
import com.pfa2.PFA2.repositories.SessionRepository;
import com.pfa2.PFA2.sec.entity.AppUser;
import com.pfa2.PFA2.sec.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SessionService {
    @Autowired
    AccountService accountService;
    @Autowired
    private SessionRepository sessionRepository;
    @Autowired
    private LanguageRepository languageRepository;
    public Session createSession(Session session, Principal principal) {
        AppUser user=accountService.loadUserByUsername(principal.getName());
        System.out.println(user);
        session.setUser(user);
        return sessionRepository.save(session);
    }
    public Session getSession(Long sessionId) {
        return sessionRepository.findById(sessionId).get();
    }
    public Session updateSession(SessionUpdateDto updateDto,Long sessionId) {
        Session existingSession = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + sessionId));

        // Gestion du temps
        if(updateDto.getEndTime() != null) {
            existingSession.setEndTime(LocalDateTime.now());
            if(existingSession.getStartTime() != null) {
                long durationInSeconds = java.time.Duration.between(
                        existingSession.getStartTime(),
                        existingSession.getEndTime()
                ).getSeconds();
                existingSession.setDuration((int) (durationInSeconds / 60));
            }
        }

        // Mise à jour des autres champs
        if(updateDto.getDuration() != null)
            existingSession.setDuration(updateDto.getDuration());
        if(updateDto.getInterruptions() != null)
            existingSession.setInterruptions(updateDto.getInterruptions());
        if(updateDto.getLinesWritten() != null)
            existingSession.setLinesWritten(updateDto.getLinesWritten());
        if(updateDto.getErrors() != null)
            existingSession.setErrors(updateDto.getErrors());

        // Gestion du langage
        if(updateDto.getLanguageName() != null) {
            if(updateDto.getLanguageName().isBlank()) {
                // Si le nom est vide, on retire le langage
                existingSession.setLanguage(null);
            } else {
                // On cherche le langage ou on le crée s'il n'existe pas
                Language language = languageRepository.findByName(updateDto.getLanguageName().trim())
                        .orElseGet(() -> {
                            Language newLang = new Language();
                            newLang.setName(updateDto.getLanguageName().trim());
                            return languageRepository.save(newLang);
                        });
                existingSession.setLanguage(language);
            }
        }

        return sessionRepository.save(existingSession);
    }
    public List<Session> getAllSessions(Principal principal) {
        AppUser user=accountService.loadUserByUsername(principal.getName());
        return sessionRepository.findByUser(user);}
    public void deleteSession(Long sessionId) {
        sessionRepository.deleteById(sessionId);
    }
}