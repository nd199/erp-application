package com.naren.erpbackend.hcm.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record PayslipResponse(
        Long payrollRunId,
        Integer periodMonth,
        Integer periodYear,
        String periodLabel,
        String runStatus,
        Long employeeId,
        String employeeName,
        String employeeEmail,
        String jobTitle,
        String departmentName,
        BigDecimal basicSalary,
        BigDecimal allowances,
        BigDecimal deductions,
        BigDecimal tax,
        BigDecimal netPay,
        BigDecimal grossEarnings,
        BigDecimal totalDeductions,
        String notes,
        String processedByName,
        Instant generatedAt
) {
}
