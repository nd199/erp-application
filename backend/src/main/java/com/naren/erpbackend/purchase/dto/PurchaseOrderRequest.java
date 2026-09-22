package com.naren.erpbackend.purchase.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public record PurchaseOrderRequest(

        @NotNull(message = "Supplier ID is required")
        Long supplierId,

        @NotNull(message = "User ID is required")
        Long userId,

        Instant orderDate,

        @Size(max = 2000, message = "Notes must not exceed 2000 characters")
        String notes,

        @NotEmpty(message = "At least one order item is required")
        @Valid
        List<PurchaseOrderItemRequest> items
) {
}
