package com.naren.erpbackend.hcm.dto;

import com.naren.erpbackend.hcm.entity.LeaveRequest;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class LeaveResponseMapper implements Function<LeaveRequest, LeaveResponse> {

    @Override
    public LeaveResponse apply(LeaveRequest entity) {
        return new LeaveResponse(
                entity.getId(),
                entity.getEmployee().getId(),
                entity.getEmployee().getFirstName() + " " + entity.getEmployee().getLastName(),
                entity.getEmployee().getEmail(),
                entity.getLeaveType(),
                entity.getFromDate(),
                entity.getToDate(),
                entity.getDays(),
                entity.getReason(),
                entity.getStatus(),
                entity.getApprovedBy() != null ? entity.getApprovedBy().getId() : null,
                entity.getApprovedBy() != null
                        ? entity.getApprovedBy().getFirstName() + " " + entity.getApprovedBy().getLastName()
                        : null,
                entity.getApprovalNotes(),
                entity.getCreatedAt(),
                entity.getLastUpdated()
        );
    }
}
