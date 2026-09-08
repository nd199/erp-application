package com.naren.erpbackend.employee.dto;

import java.time.Instant;

public record DepartmentResponse(

        Long id,
        String name,
        String description,
        Instant createdAt,
        Instant lastUpdated
) {
}
