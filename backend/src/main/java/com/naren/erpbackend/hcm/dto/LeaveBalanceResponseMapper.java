package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.LeaveBalance;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class LeaveBalanceResponseMapper {

    public LeaveBalanceResponse apply(LeaveBalance entity, BigDecimal used) {
        BigDecimal total = entity.getTotalEntitled() == null ? BigDecimal.ZERO : entity.getTotalEntitled();
        BigDecimal usedVal = used == null ? BigDecimal.ZERO : used;
        return new LeaveBalanceResponse(
                entity.getId(),
                entity.getEmployee().getId(),
                entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName(),
                entity.getEmployee().getEmail(),
                entity.getYear(),
                entity.getLeaveType(),
                total,
                usedVal,
                total.subtract(usedVal),
                entity.getCreatedAt(),
                entity.getLastUpdated()
        );
    }
}
