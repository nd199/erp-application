package com.naren.erpbackend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(

        @NotBlank(message = "Old Password is required")
        String oldPassword,

        @NotBlank(message = "New Password is required")
        @Size(min = 8, max = 72, message = "New Password must be between 8 and 72 characters")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
                message = "New Password must contain at least one lowercase letter, " +
                        "one uppercase letter and one digit"
        )
        String newPassword
) {
}
