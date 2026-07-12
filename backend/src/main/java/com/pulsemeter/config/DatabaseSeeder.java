package com.pulsemeter.config;

import com.pulsemeter.model.User;
import com.pulsemeter.repository.KpiCardRepository;
import com.pulsemeter.repository.UserRepository;
import com.pulsemeter.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final KpiCardRepository kpiCardRepository;
    private final PasswordEncoder passwordEncoder;
    private final DashboardService dashboardService;

    @Override
    public void run(String... args) {
        User defaultUser = getOrCreateDefaultUser();
        // Check if admin already has data seeded. If not, seed using the service.
        if (kpiCardRepository.findByUser(defaultUser).isEmpty()) {
            log.info("Seeding default data for admin user...");
            dashboardService.seedDefaultDataForUser(defaultUser);
        }
        log.info("Database seeding verification completed.");
    }

    private User getOrCreateDefaultUser() {
        return userRepository.findByUsername("admin")
                .orElseGet(() -> userRepository.save(User.builder()
                        .username("admin")
                        .email("admin@smartgrid.com")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("Administrator")
                        .role("ADMIN")
                        .build()));
    }
}

