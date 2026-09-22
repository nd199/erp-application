package com.naren.erpbackend.purchase.dto;

import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PurchaseOrderResponse(
        Long id,
        Long supplierId,
        String supplierName,
        Long userId,
        String userName,
        Instant orderDate,
        PurchaseOrderStatus status,
        BigDecimal totalAmount,
        String notes,
        List<PurchaseOrderItemResponse> items,
        Long version,
        Instant createdAt,
        Instant lastUpdated
) {
}
