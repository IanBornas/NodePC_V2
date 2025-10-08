package com.nodepc.backend.backend.repository;

import com.nodepc.backend.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
