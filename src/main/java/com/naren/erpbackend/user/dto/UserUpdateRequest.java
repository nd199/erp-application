package com.naren.erpbackend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserUpdateReq(

        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        @Pattern(
                regexp = "^[a-zA-Z0-9._-]+$",
                message = "Username may contain only letters, digits, dots, underscores and hyphens"
        )
        String username,

        @Email(message = "Email must be valid")
        @Size(max = 254, message = "Email must be at most 254 characters")
        String email,


        @Size(max = 15, message = "Phone must be at most 15 characters")
        @Pattern(
                regexp = "^\\+?\\d{1,15}$",
                message = "Phone must be a valid number"
        )
        String phone,

        @Size(max = 255, message = "Address must be at most 255 characters")
        String address
) {
}
