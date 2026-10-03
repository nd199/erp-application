package com.naren.erpbackend.hcm.dto;

import java.math.BigDecimal;

public record PayrollItemResponse(
        Long id,
        Long employeeId,
        String employeeName,
        String employeeEmail,
        BigDecimal basicSalary,
        BigDecimal allowances,
        BigDecimal deductions,
        BigDecimal tax,
        BigDecimal netPay,
        String notes
) {
}
