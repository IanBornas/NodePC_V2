package com.nodepc.backend.backend.controller;

import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.model.Product;
import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.service.OrderService;
import com.nodepc.backend.backend.service.ProductService;
import com.nodepc.backend.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private final ProductService productService;
    private final UserService userService;
    private final OrderService orderService;
    private final PasswordEncoder passwordEncoder;

    public AdminController(ProductService productService,
                           UserService userService,
                           OrderService orderService,
                           PasswordEncoder passwordEncoder) {
        this.productService = productService;
        this.userService = userService;
        this.orderService = orderService;
        this.passwordEncoder = passwordEncoder;
    }

    // ==================== DASHBOARD ====================

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        List<User> users = userService.getAllUsers();
        List<Product> products = productService.getAllProducts();
        List<OrderResponse> orders = orderService.getAllOrders();

        stats.put("totalUsers", users.size());
        stats.put("totalProducts", products.size());
        stats.put("totalOrders", orders.size());

        // Calculate total revenue
        double totalRevenue = orders.stream()
                .mapToDouble(order -> order.getProductPrice() * order.getQuantity())
                .sum();
        stats.put("totalRevenue", totalRevenue);

        // Low stock products
        long lowStockCount = products.stream()
                .filter(p -> p.getStock() < 10)
                .count();
        stats.put("lowStockProducts", lowStockCount);

        return ResponseEntity.ok(stats);
    }

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> roleData) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String newRole = roleData.get("role");
            if (!newRole.startsWith("ROLE_")) {
                newRole = "ROLE_" + newRole;
            }

            user.setRole(newRole);
            userService.updateUser(id, user);

            response.put("message", "User role updated successfully");
            response.put("username", user.getUsername());
            response.put("newRole", newRole);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            userService.deleteUser(id);
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/users/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Toggle between active and inactive roles
            String currentRole = user.getRole();
            if (currentRole.contains("INACTIVE")) {
                user.setRole(currentRole.replace("_INACTIVE", ""));
            } else {
                user.setRole(currentRole + "_INACTIVE");
            }

            userService.updateUser(id, user);
            response.put("message", "User status toggled");
            response.put("newStatus", user.getRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ==================== PRODUCT MANAGEMENT ====================

    @GetMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.addProduct(product));
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            productService.deleteProduct(id);
            response.put("message", "Product deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/products/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateProductStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> stockData) {
        Map<String, Object> response = new HashMap<>();
        try {
            Product product = productService.getProductById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            int newStock = stockData.get("stock");
            product.setStock(newStock);
            productService.updateProduct(id, product);

            response.put("message", "Stock updated successfully");
            response.put("productName", product.getName());
            response.put("newStock", newStock);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/products/low-stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        List<Product> lowStockProducts = productService.getAllProducts().stream()
                .filter(p -> p.getStock() < 10)
                .toList();
        return ResponseEntity.ok(lowStockProducts);
    }

    // ==================== ORDER MANAGEMENT ====================

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/orders/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteOrder(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            orderService.deleteOrder(id);
            response.put("message", "Order deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // ==================== ANALYTICS ====================

    @GetMapping("/analytics/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        List<OrderResponse> orders = orderService.getAllOrders();

        double totalRevenue = orders.stream()
                .mapToDouble(order -> order.getProductPrice() * order.getQuantity())
                .sum();

        double averageOrderValue = orders.isEmpty() ? 0 : totalRevenue / orders.size();

        analytics.put("totalRevenue", totalRevenue);
        analytics.put("averageOrderValue", averageOrderValue);
        analytics.put("totalOrders", orders.size());

        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/top-products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTopProducts() {
        Map<String, Object> analytics = new HashMap<>();

        List<OrderResponse> orders = orderService.getAllOrders();

        // Count product orders
        Map<String, Integer> productOrderCount = new HashMap<>();
        Map<String, Double> productRevenue = new HashMap<>();

        for (OrderResponse order : orders) {
            String productName = order.getProductName();
            productOrderCount.put(productName,
                    productOrderCount.getOrDefault(productName, 0) + 1);

            double revenue = order.getProductPrice() * order.getQuantity();
            productRevenue.put(productName,
                    productRevenue.getOrDefault(productName, 0.0) + revenue);
        }

        analytics.put("ordersByProduct", productOrderCount);
        analytics.put("revenueByProduct", productRevenue);

        return ResponseEntity.ok(analytics);
    }
}
