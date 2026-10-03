package com.naren.erpbackend.hcm.controller;

import com.naren.erpbackend.hcm.dto.LeaveBalanceRequest;
import com.naren.erpbackend.hcm.dto.LeaveBalanceResponse;
import com.naren.erpbackend.hcm.service.LeaveBalanceMService;
import com.naren.erpbackend.hcm.service.LeaveBalanceQService;
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
@RequestMapping("/api/v1/leave-balances")
public class LeaveBalanceController {

    private final LeaveBalanceMService leaveBalanceMService;
    private final LeaveBalanceQService leaveBalanceQService;

    @PostMapping
    @PreAuthorize("hasAuthority('LEAVE_BALANCE_CREATE')")
    public ResponseEntity<LeaveBalanceResponse> createLeaveBalance(@Valid @RequestBody LeaveBalanceRequest request) {
        log.info("Create leave balance: employeeId={}, year={}", request.employeeId(), request.year());
        LeaveBalanceResponse response = leaveBalanceMService.createLeaveBalance(request);
        log.info("Leave balance created: id={}, employeeId={}", response.id(), response.employeeId());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyAuthority('LEAVE_READ', 'LEAVE_BALANCE_READ')")
    public ResponseEntity<Page<LeaveBalanceResponse>> getMyLeaveBalances(
            @RequestParam(required = false) Integer year,
            Pageable pageable) {
        log.info("Fetch my leave balances: year={}", year);
        return ResponseEntity.ok(leaveBalanceQService.findMyLeaveBalances(year, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAVE_BALANCE_READ')")
    public ResponseEntity<LeaveBalanceResponse> getLeaveBalanceById(@PathVariable Long id) {
        log.info("Fetch leave balance: id={}", id);
        return ResponseEntity.ok(leaveBalanceQService.findLeaveBalanceById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('LEAVE_BALANCE_READ')")
    public ResponseEntity<Page<LeaveBalanceResponse>> getAllLeaveBalances(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Integer year,
            Pageable pageable) {
        log.info("Fetch leave balances: employeeId={}, year={}", employeeId, year);
        return ResponseEntity.ok(leaveBalanceQService.findAllLeaveBalances(employeeId, year, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAVE_BALANCE_UPDATE')")
    public ResponseEntity<LeaveBalanceResponse> updateLeaveBalance(
            @PathVariable Long id,
            @Valid @RequestBody LeaveBalanceRequest request) {
        log.info("Update leave balance: id={}", id);
        return ResponseEntity.ok(leaveBalanceMService.updateLeaveBalance(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAVE_BALANCE_DELETE')")
    public ResponseEntity<Void> deleteLeaveBalance(@PathVariable Long id) {
        log.info("Delete leave balance: id={}", id);
        leaveBalanceMService.deleteLeaveBalance(id);
        return ResponseEntity.noContent().build();
    }
}
