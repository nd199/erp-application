package com.naren.erpbackend.employee.dto;


import com.naren.erpbackend.user.entity.UserStatus;

import java.time.Instant;
import java.time.LocalDate;

public record EmployeeResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        LocalDate hireDate,
        String jobTitle,
        Long departmentId,
        String departmentName,
        Long userProfileId,
        UserStatus status,
        Instant createdAt,
        Instant lastUpdated
) {
}
