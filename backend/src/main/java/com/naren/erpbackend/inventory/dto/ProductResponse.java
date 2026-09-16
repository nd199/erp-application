package com.naren.erpbackend.inventory.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ProductResponse(
        Long id,
        String name,
        String sku,
        String description,
        String imageUrl,
        BigDecimal price,
        Integer quantity,
        Boolean active,
        Long version,
        Instant createdAt,
        Instant lastUpdated
) {
}
