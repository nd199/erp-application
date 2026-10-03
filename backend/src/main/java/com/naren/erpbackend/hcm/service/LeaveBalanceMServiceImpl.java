package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.LeaveBalanceRequest;
import com.naren.erpbackend.hcm.dto.LeaveBalanceResponse;
import com.naren.erpbackend.hcm.dto.LeaveBalanceResponseMapper;
import com.naren.erpbackend.hcm.entity.LeaveBalance;
import com.naren.erpbackend.hcm.repository.LeaveBalanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveBalanceMServiceImpl extends HcmUtil implements LeaveBalanceMService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceResponseMapper responseMapper;

    @Override
    public LeaveBalanceResponse createLeaveBalance(LeaveBalanceRequest request) {
        log.info("Create leave balance: employeeId={}, year={}, type={}",
                request.employeeId(), request.year(), request.leaveType());

        Employee employee = employeeRepository.findById(request.employeeId())
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + request.employeeId()));

        if (leaveBalanceRepository.existsByEmployeeIdAndYearAndLeaveType(
                employee.getId(), request.year(), request.leaveType())) {
            throw new ResourceExistsException(
                    "Leave balance already exists for employee " + employee.getId()
                            + ", year " + request.year() + ", type " + request.leaveType());
        }

        try {
            LeaveBalance balance = LeaveBalance.builder()
                    .employee(employee)
                    .year(request.year())
                    .leaveType(request.leaveType())
                    .totalEntitled(request.totalEntitled())
                    .build();
            LeaveBalance saved = leaveBalanceRepository.save(balance);
            BigDecimal used = leaveBalanceRepository.sumApprovedLeaveDays(
                    employee.getId(), request.leaveType(), request.year());
            log.info("Leave balance created: id={}", saved.getId());
            return responseMapper.apply(saved, used);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException(
                    "Leave balance already exists for employee " + employee.getId()
                            + ", year " + request.year() + ", type " + request.leaveType());
        }
    }

    @Override
    public LeaveBalanceResponse updateLeaveBalance(Long id, LeaveBalanceRequest request) {
        log.info("Update leave balance: id={}", id);

        LeaveBalance balance = leaveBalanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave balance not found with id: " + id));

        balance.setTotalEntitled(request.totalEntitled());
        LeaveBalance saved = leaveBalanceRepository.save(balance);
        BigDecimal used = leaveBalanceRepository.sumApprovedLeaveDays(
                saved.getEmployee().getId(), saved.getLeaveType(), saved.getYear());
        log.info("Leave balance updated: id={}", saved.getId());
        return responseMapper.apply(saved, used);
    }

    @Override
    public void deleteLeaveBalance(Long id) {
        log.info("Delete leave balance: id={}", id);

        LeaveBalance balance = leaveBalanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave balance not found with id: " + id));

        try {
            leaveBalanceRepository.delete(balance);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Leave balance cannot be deleted due to existing references", e);
        }
        log.info("Leave balance deleted: id={}", id);
    }
}
