package com.nodepc.backend.backend.service;

import com.nodepc.backend.backend.DTO.ProductResponse;
import com.nodepc.backend.backend.model.Product;
import com.nodepc.backend.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long countProducts() {
        return productRepository.count();
    }

    private ProductResponse convertToResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getCategory() != null ? p.getCategory().getName() : "Uncategorized"
        );
    }
}
