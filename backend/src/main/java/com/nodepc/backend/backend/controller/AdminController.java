package com.nodepc.backend.backend.controller;

import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.DTO.ProductResponse;
import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.service.OrderService;
import com.nodepc.backend.backend.service.ProductService;
import com.nodepc.backend.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {
    private final ProductService productService;
    private final UserService userService;
    private final OrderService orderService;

    public AdminController(ProductService productService, UserService userService, OrderService orderService) {
        this.productService = productService; this.userService = userService; this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String,Object>> dashboard() {
        List<User> users = userService.getAllUsers();
        List<ProductResponse> products = productService.getAllProducts();
        List<OrderResponse> orders = orderService.getAllOrders();

        Map<String,Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("totalProducts", products.size());
        stats.put("totalOrders", orders.size());
        double totalRevenue = orders.stream().mapToDouble(OrderResponse::getTotalAmount).sum();
        stats.put("totalRevenue", totalRevenue);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductResponse>> getProducts() { return ResponseEntity.ok(productService.getAllProducts()); }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsers() { return ResponseEntity.ok(userService.getAllUsers()); }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getOrders() { return ResponseEntity.ok(orderService.getAllOrders()); }
}
