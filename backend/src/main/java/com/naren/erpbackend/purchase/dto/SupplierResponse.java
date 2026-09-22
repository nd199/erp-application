package com.naren.erpbackend.purchase.dto;

import java.time.Instant;

public record SupplierResponse(
        Long id,
        String name,
        String contactPerson,
        String email,
        String phone,
        String address,
        String gstNumber,
        boolean active,
        Long version,
        Instant createdAt,
        Instant lastUpdated
) {
}
