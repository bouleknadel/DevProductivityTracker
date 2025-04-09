package com.pfa2.PFA2.sec.repo;

import com.pfa2.PFA2.sec.entity.AppRole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppRoleRepository extends JpaRepository<AppRole,Long> {
    AppRole findByRolename(String name);
}
