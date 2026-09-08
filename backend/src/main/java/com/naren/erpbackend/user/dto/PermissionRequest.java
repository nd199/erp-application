package com.naren.erpbackend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PermissionRequest(

        @NotBlank(message = "Permission name is required")
        @Size(min = 2, max = 50, message = "Permission name must be between 2 and 50 characters")
        String name,

        @Size(max = 255, message = "Description must be at most 255 characters")
        String description
) {
}
