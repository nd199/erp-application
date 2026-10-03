package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.LeaveResponse;
import com.naren.erpbackend.hcm.dto.LeaveResponseMapper;
import com.naren.erpbackend.hcm.entity.LeaveRequest;
import com.naren.erpbackend.hcm.entity.LeaveStatus;
import com.naren.erpbackend.hcm.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveQServiceImpl implements LeaveQService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveResponseMapper responseMapper;
    private final EmployeeRepository employeeRepository;

    @Override
    public LeaveResponse findLeaveById(Long id) {
        log.info("Fetch leave: id={}", id);
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .filter(l -> !l.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        return responseMapper.apply(leave);
    }

    @Override
    public Page<LeaveResponse> findAllLeaves(Pageable pageable) {
        log.info("Fetch all leaves: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return leaveRequestRepository.findAllNonDeleted(pageable).map(responseMapper);
    }

    @Override
    public Page<LeaveResponse> findLeavesByEmployee(Long employeeId, Pageable pageable) {
        log.info("Fetch leaves by employee: employeeId={}", employeeId);
        return leaveRequestRepository.findByEmployeeId(employeeId, pageable).map(responseMapper);
    }

    @Override
    public Page<LeaveResponse> findMyLeaves(Pageable pageable) {
        Long employeeId = resolveCurrentEmployeeId();
        log.info("Fetch my leaves: employeeId={}", employeeId);
        return findLeavesByEmployee(employeeId, pageable);
    }

    @Override
    public Page<LeaveResponse> findLeavesByStatus(LeaveStatus status, Pageable pageable) {
        log.info("Fetch leaves by status: status={}", status);
        return leaveRequestRepository.findByStatus(status, pageable).map(responseMapper);
    }

    @Override
    public Page<LeaveResponse> searchLeaves(String keyword, Pageable pageable) {
        log.info("Search leaves: keyword={}", keyword);
        return leaveRequestRepository.searchLeaves(keyword, pageable).map(responseMapper);
    }

    private Long resolveCurrentEmployeeId() {
        Long userId = SecurityUtils.getCurrentUserId();
        return employeeRepository.findByUserProfileId(userId)
                .map(Employee::getId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee linked to current user. Link a user account to an employee first."));
    }
}
