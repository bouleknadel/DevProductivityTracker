package com.pfa2.PFA2.entitys;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Language {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String name;


}