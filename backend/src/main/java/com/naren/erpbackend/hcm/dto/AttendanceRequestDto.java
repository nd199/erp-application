package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record AttendanceRequestDto(
        @NotNull(message = "Employee ID is required")
        Long employeeId,

        @NotNull(message = "Work date is required")
        LocalDate workDate,

        LocalTime checkIn,

        LocalTime checkOut,

        @NotNull(message = "Status is required")
        AttendanceStatus status,

        String notes
) {
}
