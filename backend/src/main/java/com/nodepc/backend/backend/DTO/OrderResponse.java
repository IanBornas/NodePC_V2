package com.nodepc.backend.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private Long productId;
    private String productName;   // ✅ added
    private double productPrice;  // ✅ added
    private int quantity;
    private Date orderDate;

    public OrderResponse(Long orderId, Long userId, Long productId,
                         String productName, double productPrice,
                         int quantity, Date orderDate) {
        this.orderId = orderId;
        this.userId = userId;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.quantity = quantity;
        this.orderDate = orderDate;
    }

    // Getters
    public Long getOrderId() { return orderId; }
    public Long getUserId() { return userId; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public double getProductPrice() { return productPrice; }
    public int getQuantity() { return quantity; }
    public Date getOrderDate() { return orderDate; }
}
