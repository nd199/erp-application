package com.naren.erpbackend.hcm.dto;

import java.util.List;

public record AttendanceSummaryResponse(
        Long employeeId,
        String employeeName,
        String employeeEmail,
        Integer year,
        Integer month,
        long present,
        long absent,
        long halfDay,
        long onLeave,
        long workFromHome,
        long holiday,
        long totalMarked,
        List<AttendanceStatusCount> breakdown
) {
}
