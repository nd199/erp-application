package com.naren.erpbackend.hcm.dto;

import jakarta.validation.constraints.NotNull;

public record LeaveStatusUpdateDto(
        @NotNull(message = "Status is required")
        String status,

        String approvalNotes
) {
}
