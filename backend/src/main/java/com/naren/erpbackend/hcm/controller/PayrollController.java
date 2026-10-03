package com.naren.erpbackend.hcm.controller;

import com.naren.erpbackend.hcm.dto.PayrollRunRequestDto;
import com.naren.erpbackend.hcm.dto.PayrollRunResponse;
import com.naren.erpbackend.hcm.dto.PayslipResponse;
import com.naren.erpbackend.hcm.entity.PayrollStatus;
import com.naren.erpbackend.hcm.service.PayrollMService;
import com.naren.erpbackend.hcm.service.PayrollQService;
import com.naren.erpbackend.hcm.service.PayslipQService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payroll-runs")
public class PayrollController {

    private final PayrollMService payrollMService;
    private final PayrollQService payrollQService;
    private final PayslipQService payslipQService;

    @PostMapping
    @PreAuthorize("hasAuthority('PAYROLL_CREATE')")
    public ResponseEntity<PayrollRunResponse> createPayrollRun(@Valid @RequestBody PayrollRunRequestDto request) {
        log.info("Create payroll run: month={}, year={}", request.periodMonth(), request.periodYear());
        PayrollRunResponse response = payrollMService.createPayrollRun(request);
        log.info("Payroll run created: id={}, period={}/{}",
                response.id(), response.periodMonth(), response.periodYear());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<PayrollRunResponse> getPayrollRunById(@PathVariable Long id) {
        log.info("Fetch payroll run: id={}", id);
        return ResponseEntity.ok(payrollQService.findPayrollRunById(id));
    }

    @GetMapping("/{runId}/payslips")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<List<PayslipResponse>> getPayslipsForRun(@PathVariable Long runId) {
        log.info("Fetch payslips for payroll run: runId={}", runId);
        return ResponseEntity.ok(payslipQService.findPayslipsForRun(runId));
    }

    @GetMapping("/{runId}/payslips/{employeeId}")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<PayslipResponse> getPayslipForRunEmployee(
            @PathVariable Long runId,
            @PathVariable Long employeeId) {
        log.info("Fetch payslip: runId={}, employeeId={}", runId, employeeId);
        return ResponseEntity.ok(payslipQService.findPayslipForRunEmployee(runId, employeeId));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<Page<PayrollRunResponse>> getAllPayrollRuns(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer year,
            Pageable pageable) {
        log.info("Fetch payroll runs: status={}, year={}", status, year);
        if (status != null && !status.isBlank()) {
            PayrollStatus payrollStatus = PayrollStatus.valueOf(status.trim().toUpperCase());
            return ResponseEntity.ok(payrollQService.findPayrollRunsByStatus(payrollStatus, pageable));
        }
        if (year != null) {
            return ResponseEntity.ok(payrollQService.findPayrollRunsByYear(year, pageable));
        }
        return ResponseEntity.ok(payrollQService.findAllPayrollRuns(pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<Page<PayrollRunResponse>> searchPayrollRuns(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search payroll runs: keyword={}", keyword);
        return ResponseEntity.ok(payrollQService.searchPayrollRuns(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('PAYROLL_UPDATE')")
    public ResponseEntity<PayrollRunResponse> updatePayrollRun(
            @PathVariable Long id,
            @Valid @RequestBody PayrollRunRequestDto request) {
        log.info("Update payroll run: id={}", id);
        return ResponseEntity.ok(payrollMService.updatePayrollRun(id, request));
    }

    @PatchMapping("/{id}/process")
    @PreAuthorize("hasAuthority('PAYROLL_PROCESS')")
    public ResponseEntity<PayrollRunResponse> processPayrollRun(@PathVariable Long id) {
        log.info("Process payroll run: id={}", id);
        return ResponseEntity.ok(payrollMService.processPayrollRun(id));
    }

    @PatchMapping("/{id}/paid")
    @PreAuthorize("hasAuthority('PAYROLL_PROCESS')")
    public ResponseEntity<PayrollRunResponse> markPayrollRunAsPaid(@PathVariable Long id) {
        log.info("Mark payroll run paid: id={}", id);
        return ResponseEntity.ok(payrollMService.markAsPaid(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PAYROLL_DELETE')")
    public ResponseEntity<Void> deletePayrollRun(@PathVariable Long id) {
        log.info("Delete payroll run: id={}", id);
        payrollMService.deletePayrollRun(id);
        return ResponseEntity.noContent().build();
    }
}
