package com.pfa2.PFA2.entitys;

import com.pfa2.PFA2.sec.entity.AppUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDateTime startTime; // sera auto-assigné

    private LocalDateTime endTime; // nullable

    private Integer duration;

    private Integer interruptions;

    private Integer linesWritten;

    private Integer errors;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private AppUser user;

    @PrePersist
    public void prePersist() {
        if (startTime == null) {
            startTime = LocalDateTime.now(); // prend heure système si non fourni
        }
    }
}
