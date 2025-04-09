package com.pfa2.PFA2.repositories;

import com.pfa2.PFA2.entitys.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}