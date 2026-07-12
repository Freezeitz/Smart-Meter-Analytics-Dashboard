package com.pulsemeter.repository;

import com.pulsemeter.model.KpiCard;
import com.pulsemeter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KpiCardRepository extends JpaRepository<KpiCard, Long> {
    List<KpiCard> findByUser(User user);
}
