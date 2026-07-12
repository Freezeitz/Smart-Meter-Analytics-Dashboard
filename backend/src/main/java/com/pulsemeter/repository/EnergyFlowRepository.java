package com.pulsemeter.repository;

import com.pulsemeter.model.EnergyFlow;
import com.pulsemeter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnergyFlowRepository extends JpaRepository<EnergyFlow, Long> {
    List<EnergyFlow> findByUser(User user);
}
