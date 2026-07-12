package com.pulsemeter.controller;

import com.pulsemeter.model.*;
import com.pulsemeter.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpi")
    public ResponseEntity<List<Map<String, Object>>> getKpiData(Principal principal) {
        return ResponseEntity.ok(dashboardService.getKpiData(principal.getName()));
    }

    @GetMapping("/consumption")
    public ResponseEntity<List<ConsumptionRecord>> getConsumptionData(Principal principal) {
        return ResponseEntity.ok(dashboardService.getConsumptionData(principal.getName()));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<ConsumptionCategory>> getCategoryData(Principal principal) {
        return ResponseEntity.ok(dashboardService.getCategoryData(principal.getName()));
    }

    @GetMapping("/energy-flow")
    public ResponseEntity<List<EnergyFlow>> getEnergyFlowData(Principal principal) {
        return ResponseEntity.ok(dashboardService.getEnergyFlowData(principal.getName()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<MeterAlert>> getAlerts(Principal principal) {
        return ResponseEntity.ok(dashboardService.getAlerts(principal.getName()));
    }
}
