package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.LeaveType;

import java.math.BigDecimal;
import java.time.Instant;

public record LeaveBalanceResponse(
        Long id,
        Long employeeId,
        String employeeName,
        String employeeEmail,
        Integer year,
        LeaveType leaveType,
        BigDecimal totalEntitled,
        BigDecimal used,
        BigDecimal remaining,
        Instant createdAt,
        Instant lastUpdated
) {
}
