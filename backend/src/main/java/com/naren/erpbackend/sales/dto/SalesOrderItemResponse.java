package com.naren.erpbackend.sales.dto;

import java.math.BigDecimal;

public record SalesOrderItemResponse(
        Long id,
        Long productId,
        String productName,
        String productSku,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {
}