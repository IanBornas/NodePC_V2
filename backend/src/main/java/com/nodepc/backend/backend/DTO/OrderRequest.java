package com.nodepc.backend.backend.DTO;

public class OrderRequest {
    private Long userId;
    private Long productId;
    private int quantity;

    public OrderRequest() {}
    public OrderRequest(Long userId, Long productId, int quantity) {
        this.userId = userId; this.productId = productId; this.quantity = quantity;
    }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
