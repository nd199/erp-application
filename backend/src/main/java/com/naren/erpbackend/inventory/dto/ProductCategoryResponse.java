package com.naren.erpbackend.inventory.dto;

import java.time.Instant;

public record ProductCategoryResponse(
        Long id,
        String name,
        String description,
        boolean active,
        Long version,
        Instant createdAt,
        Instant lastUpdated
) {
}
