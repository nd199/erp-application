package com.naren.erpbackend.user.dto;

import java.time.Instant;

public record UserResponse(

        Long id,

        String username,

        String email,

        Instant created_at,

        Instant last_updated
) {
}
