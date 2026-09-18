package com.naren.erpbackend.sales.dto;

import com.naren.erpbackend.sales.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record SalesOrderResponse(
        Long id,
        Long userId,
        String userName,
        String userEmail,
        Instant orderDate,
        OrderStatus status,
        BigDecimal totalAmount,
        String notes,
        List<SalesOrderItemResponse> items,
        Long version,
        Instant createdAt,
        Instant lastUpdated
) {
}