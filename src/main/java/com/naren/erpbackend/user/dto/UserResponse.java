package com.naren.erpbackend.user.dto;

import com.naren.erpbackend.user.entity.UserStatus;

import java.time.Instant;

public record UserResponse(

        Long id,

        String username,

        String email,

        String phone,

        String address,

        UserStatus status,

        Instant created_at,

        Instant last_updated
) {
}
