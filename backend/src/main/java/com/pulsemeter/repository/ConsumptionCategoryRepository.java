package com.pulsemeter.repository;

import com.pulsemeter.model.ConsumptionCategory;
import com.pulsemeter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsumptionCategoryRepository extends JpaRepository<ConsumptionCategory, Long> {
    List<ConsumptionCategory> findByUser(User user);
}
