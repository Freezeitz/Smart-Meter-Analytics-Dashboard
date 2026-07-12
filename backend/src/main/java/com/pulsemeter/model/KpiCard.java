package com.pulsemeter.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "kpi_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String label;
    private String value;
    private String change;
    private String trend;
    
    @Column(length = 1000)
    private String sparkline; // stored as comma-separated values
    private String color;
    private String icon;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
