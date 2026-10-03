package com.naren.erpbackend.hcm.controller;

import com.naren.erpbackend.hcm.dto.PayslipResponse;
import com.naren.erpbackend.hcm.service.PayslipQService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payslips")
public class PayslipController {

    private final PayslipQService payslipQService;

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<List<PayslipResponse>> getMyPayslips(
            @RequestParam(required = false) Integer year) {
        log.info("Fetch my payslips: year={}", year);
        return ResponseEntity.ok(payslipQService.findMyPayslips(year));
    }

    @GetMapping("/{payrollRunId}/employee/{employeeId}")
    @PreAuthorize("hasAuthority('PAYROLL_READ')")
    public ResponseEntity<PayslipResponse> getPayslipForRunEmployee(
            @PathVariable Long payrollRunId,
            @PathVariable Long employeeId) {
        log.info("Fetch payslip: payrollRunId={}, employeeId={}", payrollRunId, employeeId);
        return ResponseEntity.ok(payslipQService.findPayslipForRunEmployee(payrollRunId, employeeId));
    }
}
