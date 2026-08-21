package com.naren.erpbackend.user.dto;

import java.time.Instant;

public record RegResponse(

        String username,

        String email,

        String phone,

        String address,

        Instant created_at,

        Instant last_updated
) {
}
