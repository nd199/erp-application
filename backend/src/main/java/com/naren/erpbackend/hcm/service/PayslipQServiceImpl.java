package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.PayslipResponse;
import com.naren.erpbackend.hcm.dto.PayslipResponseMapper;
import com.naren.erpbackend.hcm.entity.PayrollRun;
import com.naren.erpbackend.hcm.entity.PayrollStatus;
import com.naren.erpbackend.hcm.repository.PayrollItemRepository;
import com.naren.erpbackend.hcm.repository.PayrollRunRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayslipQServiceImpl implements PayslipQService {

    private final PayrollRunRepository payrollRunRepository;
    private final PayrollItemRepository payrollItemRepository;
    private final EmployeeRepository employeeRepository;
    private final PayslipResponseMapper responseMapper;

    @Override
    public List<PayslipResponse> findPayslipsForRun(Long payrollRunId) {
        log.info("Fetch payslips for payroll run: payrollRunId={}", payrollRunId);
        PayrollRun run = payrollRunRepository.findById(payrollRunId)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payroll run not found with id: " + payrollRunId));
        return payrollItemRepository.findByPayrollRunIdAndDeletedFalse(run.getId()).stream()
                .map(responseMapper)
                .toList();
    }

    @Override
    public PayslipResponse findPayslipForRunEmployee(Long payrollRunId, Long employeeId) {
        log.info("Fetch payslip: payrollRunId={}, employeeId={}", payrollRunId, employeeId);
        PayrollRun run = payrollRunRepository.findById(payrollRunId)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payroll run not found with id: " + payrollRunId));
        return payrollItemRepository.findByPayrollRunIdAndDeletedFalse(run.getId()).stream()
                .filter(item -> item.getEmployee() != null
                        && item.getEmployee().getId().equals(employeeId))
                .findFirst()
                .map(responseMapper)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payslip not found for payroll run " + payrollRunId
                                + " and employee " + employeeId));
    }

    @Override
    public List<PayslipResponse> findMyPayslips(Integer year) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetch my payslips: userId={}, year={}", userId, year);
        Employee employee = employeeRepository.findByUserProfileId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee linked to current user. Link a user account to an employee first."));

        List<PayrollRun> runs = year != null
                ? payrollRunRepository.findByYear(year, Pageable.unpaged()).getContent()
                : payrollRunRepository.findAllNonDeleted(Pageable.unpaged()).getContent();

        return runs.stream()
                .filter(run -> !run.isDeleted())
                .filter(run -> run.getStatus() == PayrollStatus.COMPLETED
                        || run.getStatus() == PayrollStatus.PAID)
                .flatMap(run -> payrollItemRepository.findByPayrollRunIdAndDeletedFalse(run.getId()).stream()
                        .filter(item -> item.getEmployee() != null
                                && item.getEmployee().getId().equals(employee.getId()))
                        .map(responseMapper))
                .toList();
    }
}
