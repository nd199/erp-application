package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.LeaveType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record LeaveBalanceRequest(
        @NotNull(message = "Employee ID is required")
        Long employeeId,

        @NotNull(message = "Year is required")
        @Min(value = 2000, message = "Year must be 2000 or later")
        Integer year,

        @NotNull(message = "Leave type is required")
        LeaveType leaveType,

        @NotNull(message = "Total entitled is required")
        @DecimalMin(value = "0.0", message = "Total entitled must be zero or positive")
        @Digits(integer = 5, fraction = 1, message = "Total entitled must have at most 1 decimal")
        BigDecimal totalEntitled
) {
}
