package com.nodepc.backend.backend.controller;

import com.nodepc.backend.backend.DTO.OrderRequest;
import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    private final OrderService orderService;
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@RequestBody OrderRequest req) {
        return ResponseEntity.status(201).body(orderService.createOrder(req));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() { return ResponseEntity.ok(orderService.getAllOrders()); }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@PathVariable Long id) {
        return orderService.getOrderById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { orderService.deleteOrder(id); return ResponseEntity.noContent().build(); }
}
