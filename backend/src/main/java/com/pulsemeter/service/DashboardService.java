package com.pulsemeter.service;

import com.pulsemeter.model.*;
import com.pulsemeter.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final KpiCardRepository kpiCardRepository;
    private final ConsumptionRecordRepository consumptionRecordRepository;
    private final ConsumptionCategoryRepository consumptionCategoryRepository;
    private final EnergyFlowRepository energyFlowRepository;
    private final MeterAlertRepository meterAlertRepository;
    private final UserRepository userRepository;

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public List<Map<String, Object>> getKpiData(String username) {
        User user = getUserByUsername(username);
        return kpiCardRepository.findByUser(user).stream().map(kpi -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", kpi.getId());
            map.put("label", kpi.getLabel());
            map.put("value", kpi.getValue());
            map.put("change", kpi.getChange());
            map.put("trend", kpi.getTrend());
            // Parse sparkline from comma-separated string to array of doubles
            if (kpi.getSparkline() != null && !kpi.getSparkline().isEmpty()) {
                List<Double> sparkline = Arrays.stream(kpi.getSparkline().split(","))
                        .map(String::trim)
                        .map(Double::parseDouble)
                        .collect(Collectors.toList());
                map.put("sparkline", sparkline);
            } else {
                map.put("sparkline", Collections.emptyList());
            }
            map.put("color", kpi.getColor());
            map.put("icon", kpi.getIcon());
            return map;
        }).collect(Collectors.toList());
    }

    public List<ConsumptionRecord> getConsumptionData(String username) {
        User user = getUserByUsername(username);
        return consumptionRecordRepository.findByUser(user);
    }

    public List<ConsumptionCategory> getCategoryData(String username) {
        User user = getUserByUsername(username);
        return consumptionCategoryRepository.findByUser(user);
    }

    public List<EnergyFlow> getEnergyFlowData(String username) {
        User user = getUserByUsername(username);
        return energyFlowRepository.findByUser(user);
    }

    public List<MeterAlert> getAlerts(String username) {
        User user = getUserByUsername(username);
        return meterAlertRepository.findByUser(user);
    }

    // ─── Helpers for randomized seeding ────────────────────────────

    private double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private double round0(double v) {
        return Math.round(v);
    }

    /** Generate a 12-point sparkline that trends towards a final value */
    private String generateSparkline(double base, double finalVal, double noise, Random rng) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            double t = i / 11.0; // 0..1
            double val = base + (finalVal - base) * t + (rng.nextDouble() - 0.5) * noise;
            if (i == 11) val = finalVal; // lock the final point
            if (i > 0) sb.append(",");
            sb.append(round1(val));
        }
        return sb.toString();
    }

    /** Split 100% among N categories with controlled randomness */
    private int[] randomCategorySplit(int n, Random rng) {
        double[] raw = new double[n];
        double sum = 0;
        for (int i = 0; i < n; i++) {
            raw[i] = 1.0 + rng.nextDouble() * 4.0; // weight 1-5
            sum += raw[i];
        }
        int[] result = new int[n];
        int assigned = 0;
        for (int i = 0; i < n - 1; i++) {
            result[i] = Math.max(5, (int) Math.round(raw[i] / sum * 100));
            assigned += result[i];
        }
        result[n - 1] = Math.max(5, 100 - assigned);
        return result;
    }

    /**
     * Seeds a unique, randomized copy of dashboard data for each new user.
     * Values are realistic but differ between users so every account
     * feels personalized from the start.
     */
    @Transactional
    public void seedDefaultDataForUser(User user) {
        Random rng = new Random();

        // ── KPI Cards (randomized values) ──────────────────────────

        // Today's Usage: 5-25 kWh range
        double dailyUsage = round1(5.0 + rng.nextDouble() * 20.0);
        double dailyChange = round1(-15.0 + rng.nextDouble() * 30.0);
        String dailyTrend = dailyChange >= 0 ? "up" : "down";
        String dailyChangeStr = (dailyChange >= 0 ? "+" : "") + dailyChange + "%";
        String dailySparkline = generateSparkline(dailyUsage * 0.6, dailyUsage, dailyUsage * 0.15, rng);

        kpiCardRepository.save(KpiCard.builder().user(user)
                .label("Today's Usage").value(dailyUsage + " kWh")
                .change(dailyChangeStr).trend(dailyTrend)
                .sparkline(dailySparkline).color("brand").icon("Zap").build());

        // Monthly Usage: 150-500 kWh range
        double monthlyUsage = round0(150 + rng.nextDouble() * 350);
        double monthlyChange = round1(-10.0 + rng.nextDouble() * 25.0);
        String monthlyTrend = monthlyChange >= 0 ? "up" : "down";
        String monthlyChangeStr = (monthlyChange >= 0 ? "+" : "") + monthlyChange + "%";
        String monthlySparkline = generateSparkline(monthlyUsage * 0.65, monthlyUsage, monthlyUsage * 0.08, rng);

        kpiCardRepository.save(KpiCard.builder().user(user)
                .label("Monthly Usage").value((int) monthlyUsage + " kWh")
                .change(monthlyChangeStr).trend(monthlyTrend)
                .sparkline(monthlySparkline).color("accent").icon("Gauge").build());

        // Estimated Bill: ₹800-5,000 range (based on ~₹8/kWh)
        int estimatedBill = (int) round0(monthlyUsage * (6.0 + rng.nextDouble() * 4.0));
        double billChange = round1(-8.0 + rng.nextDouble() * 20.0);
        String billTrend = billChange >= 0 ? "up" : "down";
        String billChangeStr = (billChange >= 0 ? "+" : "") + billChange + "%";
        String billSparkline = generateSparkline(estimatedBill * 0.7, estimatedBill, estimatedBill * 0.06, rng);
        String formattedBill = "₹" + String.format("%,d", estimatedBill);

        kpiCardRepository.save(KpiCard.builder().user(user)
                .label("Estimated Bill").value(formattedBill)
                .change(billChangeStr).trend(billTrend)
                .sparkline(billSparkline).color("emerald").icon("IndianRupee").build());

        // Peak Demand: 2-8 kW range
        double peakDemand = round1(2.0 + rng.nextDouble() * 6.0);
        double peakChange = round1(-5.0 + rng.nextDouble() * 10.0);
        String peakTrend = peakChange >= 0 ? "up" : "down";
        String peakChangeStr = (peakChange >= 0 ? "+" : "") + peakChange + "%";
        String peakSparkline = generateSparkline(peakDemand * 1.15, peakDemand, peakDemand * 0.08, rng);

        kpiCardRepository.save(KpiCard.builder().user(user)
                .label("Peak Demand").value(peakDemand + " kW")
                .change(peakChangeStr).trend(peakTrend)
                .sparkline(peakSparkline).color("rose").icon("Activity").build());

        // ── Consumption History (seasonal pattern with randomness) ─

        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        // Seasonal multipliers (higher in summer months Jul/Aug)
        double[] seasonal = {0.75, 0.80, 0.85, 0.82, 0.90, 0.95, 1.10, 1.20, 1.05, 0.92, 0.85, 0.78};
        double baseConsumption = 180 + rng.nextDouble() * 200; // 180-380 base
        double baseTarget = baseConsumption * (0.85 + rng.nextDouble() * 0.3); // target slightly offset

        for (int i = 0; i < 12; i++) {
            double consumption = round0(baseConsumption * seasonal[i] * (0.9 + rng.nextDouble() * 0.2));
            double target = round0(baseTarget * (0.85 + (i / 11.0) * 0.35));
            consumptionRecordRepository.save(ConsumptionRecord.builder()
                    .user(user).month(months[i]).consumption(consumption).target(target).build());
        }

        // ── Category Loads (randomized split summing to 100%) ──────

        String[] categoryNames = {"HVAC", "Lighting", "Kitchen Appliances", "Electronics", "Others"};
        String[] categoryColors = {"#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#f43f5e"};
        int[] splits = randomCategorySplit(5, rng);

        for (int i = 0; i < 5; i++) {
            consumptionCategoryRepository.save(ConsumptionCategory.builder()
                    .user(user).name(categoryNames[i]).value(splits[i]).color(categoryColors[i]).build());
        }

        // ── Energy Transmission Stages (randomized losses) ─────────

        int generated = 40000 + rng.nextInt(30000); // 40k-70k kW
        double transmissionLoss = 0.01 + rng.nextDouble() * 0.04; // 1-5% loss
        double distributionLoss = 0.01 + rng.nextDouble() * 0.04;
        double meteringLoss = 0.005 + rng.nextDouble() * 0.02;
        double billingLoss = 0.005 + rng.nextDouble() * 0.02;

        int transmitted = (int) round0(generated * (1 - transmissionLoss));
        int distributed = (int) round0(transmitted * (1 - distributionLoss));
        int metered = (int) round0(distributed * (1 - meteringLoss));
        int billed = (int) round0(metered * (1 - billingLoss));

        energyFlowRepository.save(EnergyFlow.builder().user(user).stage("Generated").count(generated).pct(100).build());
        energyFlowRepository.save(EnergyFlow.builder().user(user).stage("Transmitted").count(transmitted).pct((int) round0(100.0 * transmitted / generated)).build());
        energyFlowRepository.save(EnergyFlow.builder().user(user).stage("Distributed").count(distributed).pct((int) round0(100.0 * distributed / generated)).build());
        energyFlowRepository.save(EnergyFlow.builder().user(user).stage("Metered").count(metered).pct((int) round0(100.0 * metered / generated)).build());
        energyFlowRepository.save(EnergyFlow.builder().user(user).stage("Billed").count(billed).pct((int) round0(100.0 * billed / generated)).build());

        // ── Alerts Stream (randomized meter IDs, zones, and times) ─

        int meterId1 = 1000 + rng.nextInt(9000);
        int meterId2 = 2000 + rng.nextInt(8000);
        char zone = (char) ('A' + rng.nextInt(6)); // Zone A-F
        String[] alertTimes = {"Just now", "2 min ago", "5 min ago", "12 min ago", "20 min ago",
                               "35 min ago", "1 hr ago", "2 hr ago", "3 hr ago", "5 hr ago"};
        // Pick 5 sorted random times
        List<String> times = new ArrayList<>(Arrays.asList(alertTimes));
        Collections.shuffle(times, rng);
        List<String> selectedTimes = times.subList(0, 5);
        // Sort by rough recency (shorter strings / "min" before "hr")
        selectedTimes.sort((a, b) -> a.length() - b.length());

        meterAlertRepository.save(MeterAlert.builder().user(user).type("alert")
                .message("High consumption detected at Meter #" + meterId1)
                .time(selectedTimes.get(0)).icon("AlertTriangle").build());
        meterAlertRepository.save(MeterAlert.builder().user(user).type("usage")
                .message("Daily consumption exceeded threshold")
                .time(selectedTimes.get(1)).icon("TrendingUp").build());
        meterAlertRepository.save(MeterAlert.builder().user(user).type("alert")
                .message("Voltage fluctuation detected in Zone " + zone)
                .time(selectedTimes.get(2)).icon("AlertTriangle").build());
        meterAlertRepository.save(MeterAlert.builder().user(user).type("meter")
                .message("Smart Meter #" + meterId2 + " successfully registered")
                .time(selectedTimes.get(3)).icon("UserPlus").build());
        meterAlertRepository.save(MeterAlert.builder().user(user).type("bill")
                .message("Estimated monthly bill recalculated")
                .time(selectedTimes.get(4)).icon("CreditCard").build());
    }
}
