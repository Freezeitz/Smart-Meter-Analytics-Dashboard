package com.pulsemeter.repository;

import com.pulsemeter.model.ConsumptionRecord;
import com.pulsemeter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsumptionRecordRepository extends JpaRepository<ConsumptionRecord, Long> {
    List<ConsumptionRecord> findByUser(User user);
}
