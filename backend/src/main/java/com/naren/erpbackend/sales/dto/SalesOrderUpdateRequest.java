package com.naren.erpbackend.sales.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Set;

public record SalesOrderUpdateRequest(

        Instant orderDate,

        @Size(max = 2000, message = "Notes must not exceed 2000 characters")
        String notes,

        @Valid
        Set<SalesOrderItemRequest> items
) {
}