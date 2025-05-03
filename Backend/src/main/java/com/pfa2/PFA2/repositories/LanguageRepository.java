package com.pfa2.PFA2.repositories;

import com.pfa2.PFA2.entitys.Language;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LanguageRepository extends JpaRepository<Language, Long> {
    public Optional<Language> findByName(String name);
}
