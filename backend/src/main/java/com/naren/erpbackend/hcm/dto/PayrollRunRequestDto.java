package com.naren.erpbackend.hcm.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PayrollRunRequestDto(
        @NotNull(message = "Period month is required")
        @Min(value = 1, message = "Month must be between 1 and 12")
        @Max(value = 12, message = "Month must be between 1 and 12")
        Integer periodMonth,

        @NotNull(message = "Period year is required")
        @Min(value = 2000, message = "Year must be 2000 or later")
        Integer periodYear,

        @Size(max = 2000, message = "Notes must not exceed 2000 characters")
        String notes,

        @NotNull(message = "Items are required")
        @Size(min = 1, message = "At least one payroll item is required")
        List<PayrollItemRequestDto> items
) {
}
