package com.naren.erpbackend.hcm.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record PayrollItemRequestDto(
        @NotNull(message = "Employee ID is required")
        Long employeeId,

        @PositiveOrZero(message = "Basic salary must be zero or positive")
        BigDecimal basicSalary,

        @PositiveOrZero(message = "Allowances must be zero or positive")
        BigDecimal allowances,

        @PositiveOrZero(message = "Deductions must be zero or positive")
        BigDecimal deductions,

        @PositiveOrZero(message = "Tax must be zero or positive")
        BigDecimal tax,

        String notes
) {
}
