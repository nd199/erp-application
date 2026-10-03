package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.AttendanceRequestDto;
import com.naren.erpbackend.hcm.dto.AttendanceResponse;
import com.naren.erpbackend.hcm.dto.AttendanceResponseMapper;
import com.naren.erpbackend.hcm.entity.AttendanceRecord;
import com.naren.erpbackend.hcm.entity.AttendanceStatus;
import com.naren.erpbackend.hcm.repository.AttendanceRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceMServiceImpl extends HcmUtil implements AttendanceMService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceResponseMapper responseMapper;

    @Override
    public AttendanceResponse markAttendance(AttendanceRequestDto request) {
        log.info("Mark attendance: employeeId={}, date={}, status={}",
                request.employeeId(), request.workDate(), request.status());

        validateTimes(request);

        Employee employee = employeeRepository.findById(request.employeeId())
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + request.employeeId()));

        Optional<AttendanceRecord> existing = attendanceRecordRepository
                .findByEmployeeIdAndWorkDateAndDeletedFalse(employee.getId(), request.workDate());

        AttendanceRecord record = existing.orElseGet(() -> AttendanceRecord.builder()
                .employee(employee)
                .workDate(request.workDate())
                .build());

        record.setStatus(request.status());
        record.setCheckIn(request.checkIn());
        record.setCheckOut(request.checkOut());
        record.setNotes(normalizeNotes(request.notes()));

        AttendanceRecord saved = attendanceRecordRepository.save(record);
        log.info("Attendance marked: id={}, employeeId={}, date={}",
                saved.getId(), employee.getId(), saved.getWorkDate());
        return responseMapper.apply(saved);
    }

    @Override
    public AttendanceResponse updateAttendance(Long id, AttendanceRequestDto request) {
        log.info("Update attendance: id={}", id);

        validateTimes(request);

        AttendanceRecord record = attendanceRecordRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance record not found with id: " + id));

        Employee employee = employeeRepository.findById(request.employeeId())
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + request.employeeId()));

        record.setEmployee(employee);
        record.setWorkDate(request.workDate());
        record.setStatus(request.status());
        record.setCheckIn(request.checkIn());
        record.setCheckOut(request.checkOut());
        record.setNotes(normalizeNotes(request.notes()));

        AttendanceRecord saved = attendanceRecordRepository.save(record);
        log.info("Attendance updated: id={}", saved.getId());
        return responseMapper.apply(saved);
    }

    @Override
    public void deleteAttendance(Long id) {
        log.info("Delete attendance: id={}", id);

        AttendanceRecord record = attendanceRecordRepository.findById(id)
                .filter(a -> !a.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance record not found with id: " + id));

        record.setDeleted(true);
        attendanceRecordRepository.save(record);
        log.info("Attendance soft-deleted: id={}", id);
    }

    private void validateTimes(AttendanceRequestDto request) {
        if (request.checkIn() != null && request.checkOut() != null
                && request.checkOut().isBefore(request.checkIn())) {
            throw new ResourceExistsException("Check-out cannot be before check-in");
        }
        boolean requiresTime = request.status() == AttendanceStatus.PRESENT
                || request.status() == AttendanceStatus.WORK_FROM_HOME;
        if (requiresTime && request.checkIn() == null) {
            throw new ResourceExistsException("Check-in is required for status " + request.status());
        }
    }
}
