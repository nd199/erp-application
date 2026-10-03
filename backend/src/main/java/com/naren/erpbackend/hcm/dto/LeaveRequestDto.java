package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.LeaveType;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record LeaveRequestDto(
        @NotNull(message = "Employee ID is required")
        Long employeeId,

        @NotNull(message = "Leave type is required")
        LeaveType leaveType,

        @NotNull(message = "From date is required")
        LocalDate fromDate,

        @NotNull(message = "To date is required")
        LocalDate toDate,

        @NotNull(message = "Days is required")
        @DecimalMin(value = "0.5", message = "Days must be at least 0.5")
        @Digits(integer = 3, fraction = 1, message = "Days must have at most 1 decimal")
        java.math.BigDecimal days,

        @Size(max = 2000, message = "Reason must not exceed 2000 characters")
        String reason
) {
}
