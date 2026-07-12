package com.pulsemeter.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "consumption_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsumptionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String month;
    private Double consumption;
    private Double target;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
