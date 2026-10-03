package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.LeaveStatus;
import com.naren.erpbackend.hcm.entity.LeaveType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record LeaveResponse(
        Long id,
        Long employeeId,
        String employeeName,
        String employeeEmail,
        LeaveType leaveType,
        LocalDate fromDate,
        LocalDate toDate,
        BigDecimal days,
        String reason,
        LeaveStatus status,
        Long approvedById,
        String approvedByName,
        String approvalNotes,
        Instant createdAt,
        Instant lastUpdated
) {
}
