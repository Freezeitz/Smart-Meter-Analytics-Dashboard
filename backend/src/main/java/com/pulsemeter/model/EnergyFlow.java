package com.pulsemeter.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "energy_flows")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnergyFlow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String stage;
    private Integer count;
    private Integer pct;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
