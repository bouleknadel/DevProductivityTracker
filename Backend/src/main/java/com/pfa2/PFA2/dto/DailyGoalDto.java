package com.pfa2.PFA2.dto;


import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class DailyGoalDto {
    @NotNull
    @Min(15) // Minimum 15 minutes
    @Max(720) // Maximum 12 heures
    private Integer dailyGoalMinutes;
}