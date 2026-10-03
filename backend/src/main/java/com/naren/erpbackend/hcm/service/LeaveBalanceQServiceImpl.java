package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.LeaveBalanceResponse;
import com.naren.erpbackend.hcm.dto.LeaveBalanceResponseMapper;
import com.naren.erpbackend.hcm.entity.LeaveBalance;
import com.naren.erpbackend.hcm.repository.LeaveBalanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveBalanceQServiceImpl implements LeaveBalanceQService {

    private final LeaveBalanceRepository leaveBalanceRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveBalanceResponseMapper responseMapper;

    @Override
    public LeaveBalanceResponse findLeaveBalanceById(Long id) {
        log.info("Fetch leave balance: id={}", id);
        LeaveBalance balance = leaveBalanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave balance not found with id: " + id));
        return toResponse(balance);
    }

    @Override
    public Page<LeaveBalanceResponse> findAllLeaveBalances(Long employeeId, Integer year, Pageable pageable) {
        log.info("Fetch leave balances: employeeId={}, year={}", employeeId, year);
        Page<LeaveBalance> page;
        if (employeeId != null && year != null) {
            page = leaveBalanceRepository.findByEmployeeIdAndYear(employeeId, year, pageable);
        } else if (employeeId != null) {
            page = leaveBalanceRepository.findByEmployeeId(employeeId, pageable);
        } else if (year != null) {
            page = leaveBalanceRepository.findByYear(year, pageable);
        } else {
            page = leaveBalanceRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    @Override
    public Page<LeaveBalanceResponse> findMyLeaveBalances(Integer year, Pageable pageable) {
        log.info("Fetch my leave balances: year={}", year);
        Long userId = SecurityUtils.getCurrentUserId();
        Employee employee = employeeRepository.findByUserProfileId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee linked to current user. Link a user account to an employee first."));

        Page<LeaveBalance> page = year != null
                ? leaveBalanceRepository.findByEmployeeIdAndYear(employee.getId(), year, pageable)
                : leaveBalanceRepository.findByEmployeeId(employee.getId(), pageable);
        return page.map(this::toResponse);
    }

    private LeaveBalanceResponse toResponse(LeaveBalance balance) {
        BigDecimal used = leaveBalanceRepository.sumApprovedLeaveDays(
                balance.getEmployee().getId(), balance.getLeaveType(), balance.getYear());
        return responseMapper.apply(balance, used);
    }
}
