package com.naren.erpbackend.employee.dto;


import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record EmployeeRequest(

        @NotBlank(message = "First name is required")
        @Size(min = 1, max = 50, message = "First name must be between 1 and 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(min = 1, max = 50, message = "Last name must be between 1 and 50 characters")
        String lastName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 254, message = "Email must not exceed 254 characters")
        String email,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^\\+?\\d{1,15}$", message = "Phone must be valid")
        String phone,

        @NotNull(message = "Hire date is required")
        @PastOrPresent(message = "Hire date cannot be in the future")
        LocalDate hireDate,

        @NotBlank(message = "Job title is required")
        @Size(min = 1, max = 100, message = "Job title must be between 1 and 100 characters")
        String jobTitle,

        @NotNull(message = "Department ID is required")
        Long departmentId,

        Long userProfileId
) {
}
