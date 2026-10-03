package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.AttendanceStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceResponse(
        Long id,
        Long employeeId,
        String employeeName,
        String employeeEmail,
        LocalDate workDate,
        LocalTime checkIn,
        LocalTime checkOut,
        AttendanceStatus status,
        String notes,
        Instant createdAt,
        Instant lastUpdated
) {
}
