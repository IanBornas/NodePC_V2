package com.nodepc.backend.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    private Long userId;
    private Long productId;
    private int quantity;
}
