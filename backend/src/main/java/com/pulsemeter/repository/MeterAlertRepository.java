package com.pulsemeter.repository;

import com.pulsemeter.model.MeterAlert;
import com.pulsemeter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MeterAlertRepository extends JpaRepository<MeterAlert, Long> {
    List<MeterAlert> findByUser(User user);
}
