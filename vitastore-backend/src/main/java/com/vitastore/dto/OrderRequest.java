package com.vitastore.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequest(
        Long userId,
        List<ItemDto> items,
        BigDecimal total,
        String note) {
    public record ItemDto(Long productId, Integer quantity, BigDecimal price) {
    }
}
