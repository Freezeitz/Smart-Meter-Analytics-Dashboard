package com.pulsemeter.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "consumption_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsumptionCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private Integer value;
    private String color;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
