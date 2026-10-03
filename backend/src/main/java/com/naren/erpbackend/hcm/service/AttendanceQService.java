package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.AttendanceResponse;
import com.naren.erpbackend.hcm.entity.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Transactional(readOnly = true)
public interface AttendanceQService {

    AttendanceResponse findAttendanceById(Long id);

    Page<AttendanceResponse> findAllAttendance(Pageable pageable);

    Page<AttendanceResponse> findAttendanceByEmployee(Long employeeId, Pageable pageable);

    Page<AttendanceResponse> findMyAttendance(LocalDate from, LocalDate to, Pageable pageable);

    Page<AttendanceResponse> findAttendanceByDate(LocalDate workDate, Pageable pageable);

    Page<AttendanceResponse> findAttendanceByStatus(AttendanceStatus status, Pageable pageable);

    Page<AttendanceResponse> findAttendanceByEmployeeAndRange(Long employeeId, LocalDate from, LocalDate to, Pageable pageable);

    Page<AttendanceResponse> searchAttendance(String keyword, Pageable pageable);
}
