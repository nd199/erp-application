package com.naren.erpbackend.hcm.controller;

import com.naren.erpbackend.hcm.dto.LeaveRequestDto;
import com.naren.erpbackend.hcm.dto.LeaveResponse;
import com.naren.erpbackend.hcm.dto.LeaveStatusUpdateDto;
import com.naren.erpbackend.hcm.entity.LeaveStatus;
import com.naren.erpbackend.hcm.service.LeaveMService;
import com.naren.erpbackend.hcm.service.LeaveQService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/leave-requests")
public class LeaveRequestController {

    private final LeaveMService leaveMService;
    private final LeaveQService leaveQService;

    @PostMapping
    @PreAuthorize("hasAuthority('LEAVE_CREATE')")
    public ResponseEntity<LeaveResponse> createLeave(@Valid @RequestBody LeaveRequestDto request) {
        log.info("Create leave: employeeId={}", request.employeeId());
        LeaveResponse response = leaveMService.createLeave(request);
        log.info("Leave created: id={}, employeeId={}", response.id(), response.employeeId());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAVE_READ')")
    public ResponseEntity<LeaveResponse> getLeaveById(@PathVariable Long id) {
        log.info("Fetch leave: id={}", id);
        return ResponseEntity.ok(leaveQService.findLeaveById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('LEAVE_READ')")
    public ResponseEntity<Page<LeaveResponse>> getAllLeaves(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        log.info("Fetch leaves: employeeId={}, status={}", employeeId, status);
        if (employeeId != null) {
            return ResponseEntity.ok(leaveQService.findLeavesByEmployee(employeeId, pageable));
        }
        if (status != null && !status.isBlank()) {
            LeaveStatus leaveStatus = LeaveStatus.valueOf(status.trim().toUpperCase());
            return ResponseEntity.ok(leaveQService.findLeavesByStatus(leaveStatus, pageable));
        }
        return ResponseEntity.ok(leaveQService.findAllLeaves(pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('LEAVE_READ')")
    public ResponseEntity<Page<LeaveResponse>> getMyLeaves(Pageable pageable) {
        log.info("Fetch my leaves");
        return ResponseEntity.ok(leaveQService.findMyLeaves(pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('LEAVE_READ')")
    public ResponseEntity<Page<LeaveResponse>> searchLeaves(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search leaves: keyword={}", keyword);
        return ResponseEntity.ok(leaveQService.searchLeaves(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAVE_UPDATE')")
    public ResponseEntity<LeaveResponse> updateLeave(
            @PathVariable Long id,
            @Valid @RequestBody LeaveRequestDto request) {
        log.info("Update leave: id={}", id);
        return ResponseEntity.ok(leaveMService.updateLeave(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('LEAVE_APPROVE')")
    public ResponseEntity<LeaveResponse> updateLeaveStatus(
            @PathVariable Long id,
            @Valid @RequestBody LeaveStatusUpdateDto request) {
        log.info("Approve/reject leave: id={}, status={}", id, request.status());
        return ResponseEntity.ok(leaveMService.approveOrReject(id, request.status(), request.approvalNotes()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAVE_DELETE')")
    public ResponseEntity<Void> deleteLeave(@PathVariable Long id) {
        log.info("Delete leave: id={}", id);
        leaveMService.deleteLeave(id);
        return ResponseEntity.noContent().build();
    }
}
