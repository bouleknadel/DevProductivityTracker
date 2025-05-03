package com.pfa2.PFA2.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionUpdateDto {
    private LocalDateTime endTime;
    private Integer duration;
    private Integer interruptions;
    private Integer linesWritten;
    private Integer errors;
    private String languageName; // On reçoit le nom du langage depuis le front
}