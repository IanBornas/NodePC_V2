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
        // Input validation
        if (req.getUserId() == null || req.getUserId() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        if (req.getProductId() == null || req.getProductId() <= 0) {
            return ResponseEntity.badRequest().build();
        }
        if (req.getQuantity() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.status(201).body(orderService.createOrder(req));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAll() { return ResponseEntity.ok(orderService.getAllOrders()); }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getById(@PathVariable Long id) {
        return orderService.getOrderById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderResponse>> getByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(customerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { orderService.deleteOrder(id); return ResponseEntity.noContent().build(); }
}
