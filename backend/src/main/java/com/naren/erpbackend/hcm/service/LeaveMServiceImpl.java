package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.LeaveRequestDto;
import com.naren.erpbackend.hcm.dto.LeaveResponse;
import com.naren.erpbackend.hcm.dto.LeaveResponseMapper;
import com.naren.erpbackend.hcm.entity.LeaveRequest;
import com.naren.erpbackend.hcm.entity.LeaveStatus;
import com.naren.erpbackend.hcm.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class LeaveMServiceImpl extends HcmUtil implements LeaveMService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveResponseMapper responseMapper;

    @Override
    public LeaveResponse createLeave(LeaveRequestDto request) {
        log.info("Create leave: employeeId={}, type={}, from={}, to={}",
                request.employeeId(), request.leaveType(), request.fromDate(), request.toDate());

        validateDates(request);

        Employee employee = employeeRepository.findById(request.employeeId())
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + request.employeeId()));

        long overlapping = leaveRequestRepository.countOverlapping(
                employee.getId(), request.fromDate(), request.toDate());
        if (overlapping > 0) {
            throw new ResourceExistsException(
                    "Employee already has leave overlapping " + request.fromDate() + " to " + request.toDate());
        }

        LeaveRequest leave = LeaveRequest.builder()
                .employee(employee)
                .leaveType(request.leaveType())
                .fromDate(request.fromDate())
                .toDate(request.toDate())
                .days(request.days())
                .reason(normalizeNotes(request.reason()))
                .status(LeaveStatus.PENDING)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leave);
        log.info("Leave created: id={}, employeeId={}", saved.getId(), employee.getId());
        return responseMapper.apply(saved);
    }

    @Override
    public LeaveResponse updateLeave(Long id, LeaveRequestDto request) {
        log.info("Update leave: id={}", id);

        LeaveRequest leave = leaveRequestRepository.findById(id)
                .filter(l -> !l.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new ResourceExistsException("Only PENDING leave requests can be updated");
        }

        validateDates(request);

        Employee employee = employeeRepository.findById(request.employeeId())
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + request.employeeId()));

        leave.setEmployee(employee);
        leave.setLeaveType(request.leaveType());
        leave.setFromDate(request.fromDate());
        leave.setToDate(request.toDate());
        leave.setDays(request.days());
        leave.setReason(normalizeNotes(request.reason()));

        LeaveRequest saved = leaveRequestRepository.save(leave);
        log.info("Leave updated: id={}", saved.getId());
        return responseMapper.apply(saved);
    }

    @Override
    public LeaveResponse approveOrReject(Long id, String status, String approvalNotes) {
        log.info("Approve/reject leave: id={}, status={}", id, status);

        LeaveRequest leave = leaveRequestRepository.findById(id)
                .filter(l -> !l.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        LeaveStatus newStatus;
        try {
            newStatus = LeaveStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid leave status: " + status);
        }

        if (newStatus != LeaveStatus.APPROVED && newStatus != LeaveStatus.REJECTED) {
            throw new ResourceExistsException("Status must be APPROVED or REJECTED");
        }
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new ResourceExistsException("Only PENDING leave requests can be approved or rejected");
        }

        Employee approver = resolveCurrentEmployee();
        leave.setStatus(newStatus);
        leave.setApprovedBy(approver);
        leave.setApprovalNotes(normalizeNotes(approvalNotes));

        LeaveRequest saved = leaveRequestRepository.save(leave);
        log.info("Leave {}: id={}, approverId={}", newStatus, saved.getId(), approver.getId());
        return responseMapper.apply(saved);
    }

    @Override
    public void deleteLeave(Long id) {
        log.info("Delete leave: id={}", id);

        LeaveRequest leave = leaveRequestRepository.findById(id)
                .filter(l -> !l.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        leave.setDeleted(true);
        leaveRequestRepository.save(leave);
        log.info("Leave soft-deleted: id={}", id);
    }

    private void validateDates(LeaveRequestDto request) {
        if (request.toDate().isBefore(request.fromDate())) {
            throw new ResourceExistsException("To date cannot be before from date");
        }
        long inclusiveDays = ChronoUnit.DAYS.between(request.fromDate(), request.toDate()) + 1;
        if (request.days().doubleValue() > inclusiveDays) {
            throw new ResourceExistsException("Days cannot exceed calendar days between dates");
        }
    }

    private Employee resolveCurrentEmployee() {
        Long userId = SecurityUtils.getCurrentUserId();
        return employeeRepository.findByUserProfileId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee linked to current user. Link a user account to an employee first."));
    }
}
