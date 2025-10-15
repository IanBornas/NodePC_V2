package com.nodepc.backend.backend.controller;

import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.DTO.ProductResponse;
import com.nodepc.backend.backend.model.Product;
import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.service.OrderService;
import com.nodepc.backend.backend.service.ProductService;
import com.nodepc.backend.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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

    @PutMapping("/products/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProductStock(@PathVariable Long id, @RequestParam int stock) {
        Product product = productService.getProductEntityById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        product.setStock(stock);
        Product updated = productService.updateProduct(id, product);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping("/products/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadProductImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "File is empty");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate file size (max 5MB)
            long maxFileSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxFileSize) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "File size exceeds maximum allowed size of 5MB");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Only image files are allowed");
                return ResponseEntity.badRequest().body(error);
            }

            // Validate file extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid filename");
                return ResponseEntity.badRequest().body(error);
            }

            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
            if (!fileExtension.matches("\\.(jpg|jpeg|png|gif|webp)$")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file extension. Allowed: jpg, jpeg, png, gif, webp");
                return ResponseEntity.badRequest().body(error);
            }

            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get("uploads/products");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate secure filename (prevent path traversal)
            String filename = "product_" + id + "_" + System.currentTimeMillis() + fileExtension;
            Path filePath = uploadPath.resolve(filename);

            // Ensure the resolved path is within the intended directory
            if (!filePath.normalize().startsWith(uploadPath.normalize())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid file path");
                return ResponseEntity.badRequest().body(error);
            }

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update product image URL
            Product product = productService.getProductEntityById(id);
            if (product == null) {
                return ResponseEntity.notFound().build();
            }

            String imageUrl = "/uploads/products/" + filename;
            product.setImageUrl(imageUrl);
            productService.updateProduct(id, product);

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", imageUrl);
            response.put("message", "Image uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
