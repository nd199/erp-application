package com.naren.erpbackend.sales.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;


public record SalesOrderRequest(

        @NotNull(message = "User ID is required")
        Long userId,

        Instant orderDate,

        @Size(max = 2000, message = "Notes must not exceed 2000 characters")
        String notes,

        @NotEmpty(message = "At least one order item is required")
        @Valid
        List<SalesOrderItemRequest> items
) {
}