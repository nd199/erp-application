package com.naren.erpbackend.user.dto;

import java.time.Instant;

public record UserResponse(

        Long id,

        String username,

        String email,

        String phone,

        String address,

        Instant created_at,

        Instant last_updated
) {
}
