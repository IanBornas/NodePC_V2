package com.nodepc.backend.backend.controller;

import com.nodepc.backend.backend.DTO.ProductResponse;
import com.nodepc.backend.backend.model.Product;
import com.nodepc.backend.backend.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;
    public ProductController(ProductService productService) { this.productService = productService; }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        logger.info("[NodePC] Get all products");
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return productService.getProductById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> create(@RequestBody Product product) {
        // Input validation
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (product.getPrice() == null || product.getPrice().doubleValue() < 0) {
            return ResponseEntity.badRequest().build();
        }
        if (product.getStock() < 0) {
            return ResponseEntity.badRequest().build();
        }

        // Sanitize input
        product.setName(product.getName().trim());
        if (product.getDescription() != null) {
            product.setDescription(product.getDescription().trim());
        }
        if (product.getCategory() != null) {
            product.setCategory(product.getCategory().trim());
        }

        logger.info("[NodePC] Create product: {}", product.getName());
        return ResponseEntity.status(201).body(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        // Input validation
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (product.getPrice() == null || product.getPrice().doubleValue() < 0) {
            return ResponseEntity.badRequest().build();
        }
        if (product.getStock() < 0) {
            return ResponseEntity.badRequest().build();
        }

        // Sanitize input
        product.setName(product.getName().trim());
        if (product.getDescription() != null) {
            product.setDescription(product.getDescription().trim());
        }
        if (product.getCategory() != null) {
            product.setCategory(product.getCategory().trim());
        }

        Product updated = productService.updateProduct(id, product);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id); return ResponseEntity.noContent().build();
    }
}
