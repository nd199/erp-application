package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.PayrollItemRequestDto;
import com.naren.erpbackend.hcm.dto.PayrollRunRequestDto;
import com.naren.erpbackend.hcm.dto.PayrollRunResponse;
import com.naren.erpbackend.hcm.dto.PayrollRunResponseMapper;
import com.naren.erpbackend.hcm.entity.PayrollItem;
import com.naren.erpbackend.hcm.entity.PayrollRun;
import com.naren.erpbackend.hcm.entity.PayrollStatus;
import com.naren.erpbackend.hcm.repository.PayrollItemRepository;
import com.naren.erpbackend.hcm.repository.PayrollRunRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayrollMServiceImpl extends HcmUtil implements PayrollMService {

    private final PayrollRunRepository payrollRunRepository;
    private final PayrollItemRepository payrollItemRepository;
    private final EmployeeRepository employeeRepository;
    private final PayrollRunResponseMapper responseMapper;

    @Override
    @Transactional
    public PayrollRunResponse createPayrollRun(PayrollRunRequestDto request) {
        log.info("Create payroll run: month={}, year={}, items={}",
                request.periodMonth(), request.periodYear(), request.items().size());

        payrollRunRepository.findByPeriodMonthAndPeriodYearAndDeletedFalse(
                        request.periodMonth(), request.periodYear())
                .ifPresent(existing -> {
                    throw new ResourceExistsException(
                            "Payroll run already exists for period " + request.periodMonth() + "/" + request.periodYear());
                });

        Set<Long> seenEmployees = new HashSet<>();
        for (PayrollItemRequestDto item : request.items()) {
            if (!seenEmployees.add(item.employeeId())) {
                throw new ResourceExistsException(
                        "Duplicate employee in payroll items: " + item.employeeId());
            }
        }

        PayrollRun run = PayrollRun.builder()
                .periodMonth(request.periodMonth())
                .periodYear(request.periodYear())
                .status(PayrollStatus.DRAFT)
                .notes(normalizeNotes(request.notes()))
                .build();

        for (PayrollItemRequestDto itemDto : request.items()) {
            Employee employee = employeeRepository.findById(itemDto.employeeId())
                    .filter(e -> !e.isDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Employee not found with id: " + itemDto.employeeId()));

            BigDecimal basic = nz(itemDto.basicSalary());
            BigDecimal allowances = nz(itemDto.allowances());
            BigDecimal deductions = nz(itemDto.deductions());
            BigDecimal tax = nz(itemDto.tax());
            BigDecimal net = basic.add(allowances).subtract(deductions).subtract(tax);

            if (net.signum() < 0) {
                throw new ResourceExistsException(
                        "Net pay cannot be negative for employee " + employee.getId());
            }

            run.getItems().add(PayrollItem.builder()
                    .payrollRun(run)
                    .employee(employee)
                    .basicSalary(basic)
                    .allowances(allowances)
                    .deductions(deductions)
                    .tax(tax)
                    .netPay(net.setScale(2, RoundingMode.HALF_UP))
                    .notes(normalizeNotes(itemDto.notes()))
                    .build());
        }

        recalculateTotals(run);
        PayrollRun saved = payrollRunRepository.save(run);
        log.info("Payroll run created: id={}, period={}/{}", saved.getId(), saved.getPeriodMonth(), saved.getPeriodYear());
        return responseMapper.apply(saved);
    }

    @Override
    @Transactional
    public PayrollRunResponse updatePayrollRun(Long id, PayrollRunRequestDto request) {
        log.info("Update payroll run: id={}", id);

        PayrollRun run = payrollRunRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found with id: " + id));

        if (run.getStatus() != PayrollStatus.DRAFT) {
            throw new ResourceExistsException("Only DRAFT payroll runs can be updated");
        }

        payrollRunRepository.findByPeriodMonthAndPeriodYearAndDeletedFalse(
                        request.periodMonth(), request.periodYear())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(existing -> {
                    throw new ResourceExistsException(
                            "Payroll run already exists for period " + request.periodMonth() + "/" + request.periodYear());
                });

        run.getItems().clear();
        Set<Long> seenEmployees = new HashSet<>();
        for (PayrollItemRequestDto itemDto : request.items()) {
            if (!seenEmployees.add(itemDto.employeeId())) {
                throw new ResourceExistsException("Duplicate employee in payroll items: " + itemDto.employeeId());
            }
            Employee employee = employeeRepository.findById(itemDto.employeeId())
                    .filter(e -> !e.isDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Employee not found with id: " + itemDto.employeeId()));

            BigDecimal basic = nz(itemDto.basicSalary());
            BigDecimal allowances = nz(itemDto.allowances());
            BigDecimal deductions = nz(itemDto.deductions());
            BigDecimal tax = nz(itemDto.tax());
            BigDecimal net = basic.add(allowances).subtract(deductions).subtract(tax);
            if (net.signum() < 0) {
                throw new ResourceExistsException("Net pay cannot be negative for employee " + employee.getId());
            }

            run.getItems().add(PayrollItem.builder()
                    .payrollRun(run)
                    .employee(employee)
                    .basicSalary(basic)
                    .allowances(allowances)
                    .deductions(deductions)
                    .tax(tax)
                    .netPay(net.setScale(2, RoundingMode.HALF_UP))
                    .notes(normalizeNotes(itemDto.notes()))
                    .build());
        }

        run.setPeriodMonth(request.periodMonth());
        run.setPeriodYear(request.periodYear());
        run.setNotes(normalizeNotes(request.notes()));
        recalculateTotals(run);

        PayrollRun saved = payrollRunRepository.save(run);
        log.info("Payroll run updated: id={}", saved.getId());
        return responseMapper.apply(saved);
    }

    @Override
    @Transactional
    public PayrollRunResponse processPayrollRun(Long id) {
        log.info("Process payroll run: id={}", id);

        PayrollRun run = payrollRunRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found with id: " + id));

        if (run.getStatus() != PayrollStatus.DRAFT && run.getStatus() != PayrollStatus.PROCESSING) {
            throw new ResourceExistsException("Payroll run cannot be processed from status " + run.getStatus());
        }

        Employee processor = resolveCurrentEmployee();
        recalculateTotals(run);
        run.setStatus(PayrollStatus.COMPLETED);
        run.setProcessedBy(processor);

        PayrollRun saved = payrollRunRepository.save(run);
        log.info("Payroll run processed: id={}, totalNet={}", saved.getId(), saved.getTotalNet());
        return responseMapper.apply(saved);
    }

    @Override
    @Transactional
    public PayrollRunResponse markAsPaid(Long id) {
        log.info("Mark payroll run paid: id={}", id);

        PayrollRun run = payrollRunRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found with id: " + id));

        if (run.getStatus() != PayrollStatus.COMPLETED) {
            throw new ResourceExistsException("Only COMPLETED payroll runs can be marked as paid");
        }

        run.setStatus(PayrollStatus.PAID);
        PayrollRun saved = payrollRunRepository.save(run);
        log.info("Payroll run marked paid: id={}", saved.getId());
        return responseMapper.apply(saved);
    }

    @Override
    public void deletePayrollRun(Long id) {
        log.info("Delete payroll run: id={}", id);

        PayrollRun run = payrollRunRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found with id: " + id));

        if (run.getStatus() == PayrollStatus.PAID) {
            throw new ResourceExistsException("Paid payroll runs cannot be deleted");
        }

        run.setDeleted(true);
        payrollRunRepository.save(run);
        log.info("Payroll run soft-deleted: id={}", id);
    }

    private void recalculateTotals(PayrollRun run) {
        BigDecimal gross = BigDecimal.ZERO;
        BigDecimal deductions = BigDecimal.ZERO;
        BigDecimal net = BigDecimal.ZERO;
        for (PayrollItem item : run.getItems()) {
            gross = gross.add(item.getBasicSalary()).add(item.getAllowances());
            deductions = deductions.add(item.getDeductions()).add(item.getTax());
            net = net.add(item.getNetPay());
        }
        run.setTotalGross(gross.setScale(2, RoundingMode.HALF_UP));
        run.setTotalDeductions(deductions.setScale(2, RoundingMode.HALF_UP));
        run.setTotalNet(net.setScale(2, RoundingMode.HALF_UP));
    }

    private BigDecimal nz(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value.setScale(2, RoundingMode.HALF_UP);
    }

    private Employee resolveCurrentEmployee() {
        Long userId = SecurityUtils.getCurrentUserId();
        return employeeRepository.findByUserProfileId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee linked to current user. Link a user account to an employee first."));
    }
}
