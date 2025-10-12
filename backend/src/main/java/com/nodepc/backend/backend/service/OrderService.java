package com.nodepc.backend.backend.service;

import com.nodepc.backend.backend.DTO.OrderRequest;
import com.nodepc.backend.backend.DTO.OrderResponse;
import com.nodepc.backend.backend.model.Order;
import com.nodepc.backend.backend.model.Product;
import com.nodepc.backend.backend.model.User;
import com.nodepc.backend.backend.repository.OrderRepository;
import com.nodepc.backend.backend.repository.ProductRepository;
import com.nodepc.backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public long countOrders() {
        return orderRepository.count();
    }

    public OrderResponse createOrder(OrderRequest req) {
        Optional<User> userOpt = userRepository.findById(req.getUserId());
        Optional<Product> productOpt = productRepository.findById(req.getProductId());
        if (userOpt.isEmpty() || productOpt.isEmpty()) {
            return null; // or throw exception
        }
        User user = userOpt.get();
        Product product = productOpt.get();
        double totalAmount = product.getPrice().doubleValue() * req.getQuantity();
        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setQuantity(req.getQuantity());
        order.setTotalAmount(totalAmount);
        order.setStatus("Pending");
        order.setOrderDate(new Date());
        Order saved = orderRepository.save(order);
        return convertToResponse(saved);
    }

    public Optional<OrderResponse> getOrderById(Long id) {
        return orderRepository.findById(id).map(this::convertToResponse);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
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
