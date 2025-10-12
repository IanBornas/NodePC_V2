package com.nodepc.backend.backend.service;

import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.model.Order;
import com.nodepc.backend.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long countOrders() {
        return orderRepository.count();
    }

    private OrderResponse convertToResponse(Order o) {
        return new OrderResponse(
                o.getId(),
                o.getUser() != null ? o.getUser().getUsername() : "Unknown",
                o.getTotalAmount(),
                o.getStatus()
        );
    }
}
