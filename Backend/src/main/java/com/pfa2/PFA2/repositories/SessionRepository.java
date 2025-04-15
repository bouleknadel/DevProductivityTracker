package com.pfa2.PFA2.repositories;

import com.pfa2.PFA2.entitys.Session;
import com.pfa2.PFA2.sec.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUserAndStartTimeBetween(AppUser user, LocalDateTime start, LocalDateTime end);

}