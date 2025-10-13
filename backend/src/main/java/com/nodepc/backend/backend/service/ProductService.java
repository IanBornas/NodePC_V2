package com.nodepc.backend.backend.service;

import com.nodepc.backend.backend.DTO.ProductResponse;
import com.nodepc.backend.backend.model.Product;
import com.nodepc.backend.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
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

    public Optional<ProductResponse> getProductById(Long id) {
        return productRepository.findById(id).map(this::convertToResponse);
    }

    public Product getProductEntityById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        if (productRepository.existsById(id)) {
            product.setId(id);
            return productRepository.save(product);
        }
        return null;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private ProductResponse convertToResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice().doubleValue(),
                p.getStock(),
                p.getCategory() != null ? p.getCategory() : "Uncategorized",
                p.getImageUrl()
        );
    }
}
