package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.AttendanceResponse;
import com.naren.erpbackend.hcm.dto.AttendanceResponseMapper;
import com.naren.erpbackend.hcm.entity.AttendanceRecord;
import com.naren.erpbackend.hcm.entity.AttendanceStatus;
import com.naren.erpbackend.hcm.repository.AttendanceRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceQServiceImpl implements AttendanceQService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final AttendanceResponseMapper responseMapper;
    private final EmployeeRepository employeeRepository;

    @Override
    public AttendanceResponse findAttendanceById(Long id) {
        log.info("Fetch attendance: id={}", id);
        AttendanceRecord record = attendanceRecordRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance record not found with id: " + id));
        return responseMapper.apply(record);
    }

    @Override
    public Page<AttendanceResponse> findAllAttendance(Pageable pageable) {
        log.info("Fetch all attendance: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return attendanceRecordRepository.findAllNonDeleted(pageable).map(responseMapper);
    }

    @Override
    public Page<AttendanceResponse> findAttendanceByEmployee(Long employeeId, Pageable pageable) {
        log.info("Fetch attendance by employee: employeeId={}", employeeId);
        return attendanceRecordRepository.findByEmployeeId(employeeId, pageable).map(responseMapper);
    }

    @Override
    public Page<AttendanceResponse> findMyAttendance(LocalDate from, LocalDate to, Pageable pageable) {
        Long employeeId = resolveCurrentEmployeeId();
        log.info("Fetch my attendance: employeeId={}, from={}, to={}", employeeId, from, to);
        if (from != null && to != null) {
            return findAttendanceByEmployeeAndRange(employeeId, from, to, pageable);
        }
        return findAttendanceByEmployee(employeeId, pageable);
    }

    @Override
    public Page<AttendanceResponse> findAttendanceByDate(LocalDate workDate, Pageable pageable) {
        log.info("Fetch attendance by date: workDate={}", workDate);
        return attendanceRecordRepository.findByWorkDate(workDate, pageable).map(responseMapper);
    }

    @Override
    public Page<AttendanceResponse> findAttendanceByStatus(AttendanceStatus status, Pageable pageable) {
        log.info("Fetch attendance by status: status={}", status);
        return attendanceRecordRepository.findByStatus(status, pageable).map(responseMapper);
    }

    @Override
    public Page<AttendanceResponse> findAttendanceByEmployeeAndRange(Long employeeId, LocalDate from, LocalDate to, Pageable pageable) {
        log.info("Fetch attendance range: employeeId={}, from={}, to={}", employeeId, from, to);
        return attendanceRecordRepository.findByEmployeeAndDateRange(employeeId, from, to, pageable)
                .map(responseMapper);
    }

    @Override
    public Page<AttendanceResponse> searchAttendance(String keyword, Pageable pageable) {
        log.info("Search attendance: keyword={}", keyword);
        return attendanceRecordRepository.searchAttendance(keyword, pageable).map(responseMapper);
    }

    private Long resolveCurrentEmployeeId() {
        Long userId = SecurityUtils.getCurrentUserId();
        return employeeRepository.findByUserProfileId(userId)
                .map(Employee::getId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee linked to current user. Link a user account to an employee first."));
    }
}
