package com.pfa2.PFA2.controllers;

import com.pfa2.PFA2.entitys.Session;
import com.pfa2.PFA2.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {
    @Autowired
    private SessionService sessionService;
    @PostMapping
    public Session createSession(@RequestBody Session session, Principal principal) {
        return sessionService.createSession(session,principal);
    }
    @GetMapping
    public List<Session> getAllSessions() {return sessionService.getAllSessions();}
    @GetMapping("/{id}")
    public Session getSessionById(@PathVariable Long id) {
        return sessionService.getSession(id);
    }
    @PutMapping("/{id}")
    public Session updateSession(@RequestBody Session session,@PathVariable Long id) {
        return sessionService.updateSession(session,id);
    }
    @DeleteMapping("/{id}")
    public void deleteSession(@PathVariable Long id) {
        sessionService.deleteSession(id);
    }
}