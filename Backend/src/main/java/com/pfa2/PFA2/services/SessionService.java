package com.pfa2.PFA2.services;

import com.pfa2.PFA2.entitys.Session;
import com.pfa2.PFA2.repositories.SessionRepository;
import com.pfa2.PFA2.sec.entity.AppUser;
import com.pfa2.PFA2.sec.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class SessionService {
    @Autowired
    AccountService accountService;
    @Autowired
    private SessionRepository sessionRepository;
    public Session createSession(Session session, Principal principal) {
        AppUser user=accountService.loadUserByUsername(principal.getName());
        System.out.println(user);
        session.setUser(user);
        return sessionRepository.save(session);
    }
    public Session getSession(Long sessionId) {
        return sessionRepository.findById(sessionId).get();
    }
    public Session updateSession(Session session, Long id) {
        Session existingSession = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found with id: " + id));
        if(session.getEndTime()!=null)
        existingSession.setEndTime(session.getEndTime());
        if(session.getDuration()!=null)
        existingSession.setDuration(session.getDuration());
        if(session.getInterruptions()!=null)
        existingSession.setInterruptions(session.getInterruptions());
        if(session.getLinesWritten()!=null)
        existingSession.setLinesWritten(session.getLinesWritten());
        if(session.getErrors()!=null)
        existingSession.setErrors(session.getErrors());
        return sessionRepository.save(existingSession);
    }

    public List<Session> getAllSessions() {return sessionRepository.findAll();}
    public void deleteSession(Long sessionId) {
        sessionRepository.deleteById(sessionId);
    }
}