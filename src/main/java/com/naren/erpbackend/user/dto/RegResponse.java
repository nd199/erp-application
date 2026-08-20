package com.naren.erpbackend.user.dto;

import java.time.Instant;

public record RegResponse(

        String username,

        String email,

        Instant createdAt,

        Instant lastUpdated
) {
}
