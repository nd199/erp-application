package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.PayrollStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PayrollRunResponse(
        Long id,
        Integer periodMonth,
        Integer periodYear,
        String periodLabel,
        PayrollStatus status,
        BigDecimal totalGross,
        BigDecimal totalDeductions,
        BigDecimal totalNet,
        Long processedById,
        String processedByName,
        String notes,
        List<PayrollItemResponse> items,
        Instant createdAt,
        Instant lastUpdated
) {
}
