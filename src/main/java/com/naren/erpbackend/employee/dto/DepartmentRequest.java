package com.naren.erpbackend.employee.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentRequest(

        @NotBlank(message = "Department name is required")
        @Size(min = 3, max = 100, message = "Department name must be between 3 and 100 characters")
        String name,
        @Size(max = 500, message = "Department description must not exceed 500 characters")
        String description
) {
}
