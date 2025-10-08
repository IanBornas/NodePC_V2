package com.nodepc.backend.backend.service;

import com.nodepc.backend.backend.DTO.OrderRequest;
import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.model.Order;
import com.nodepc.backend.backend.model.Product;
import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.repository.OrderRepository;
import com.nodepc.backend.backend.repository.ProductRepository;
import com.nodepc.backend.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // Create order using DTOs and return OrderResponse (with product info)
    public OrderResponse createOrder(OrderRequest orderRequest) {
        User user = userRepository.findById(orderRequest.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(orderRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() < orderRequest.getQuantity()) {
            throw new RuntimeException("Not enough stock available");
        }

        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(orderRequest.getQuantity());
        order.setOrderDate(new Date());

        // reduce stock and save product
        product.setStock(product.getStock() - orderRequest.getQuantity());
        productRepository.save(product);

        // save order
        Order saved = orderRepository.save(order);

        // build DTO including product name & price for analytics
        return new OrderResponse(
                saved.getId(),
                user.getId(),
                product.getId(),
                product.getName(),      // product name from Product entity
                product.getPrice(),     // product price from Product entity
                saved.getQuantity(),    // quantity from saved Order entity
                saved.getOrderDate()    // orderDate from saved Order entity
        );
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> new OrderResponse(
                        order.getId(),
                        order.getUser().getId(),
                        order.getProduct().getId(),
                        order.getProduct().getName(),
                        order.getProduct().getPrice(),
                        order.getQuantity(),
                        order.getOrderDate()
                ))
                .collect(Collectors.toList());
    }

    public Optional<OrderResponse> getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(order -> new OrderResponse(
                        order.getId(),
                        order.getUser().getId(),
                        order.getProduct().getId(),
                        order.getProduct().getName(),
                        order.getProduct().getPrice(),
                        order.getQuantity(),
                        order.getOrderDate()
                ));
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
