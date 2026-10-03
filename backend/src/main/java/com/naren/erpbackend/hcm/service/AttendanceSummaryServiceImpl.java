package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.hcm.dto.AttendanceStatusCount;
import com.naren.erpbackend.hcm.dto.AttendanceSummaryResponse;
import com.naren.erpbackend.hcm.entity.AttendanceRecord;
import com.naren.erpbackend.hcm.entity.AttendanceStatus;
import com.naren.erpbackend.hcm.repository.AttendanceRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttendanceSummaryServiceImpl implements AttendanceSummaryService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public AttendanceSummaryResponse summarizeForEmployee(Long employeeId, Integer year, Integer month) {
        log.info("Summarize attendance: employeeId={}, year={}, month={}", employeeId, year, month);
        Employee employee = employeeRepository.findById(employeeId)
                .filter(e -> !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + employeeId));
        List<AttendanceRecord> records = attendanceRecordRepository.findAllByEmployeeId(employeeId);
        return buildSummary(employee, records, year, month);
    }

    @Override
    public List<AttendanceSummaryResponse> summarizeAll(Integer year, Integer month) {
        log.info("Summarize attendance for all: year={}, month={}", year, month);
        List<Employee> employees = employeeRepository.findAll().stream()
                .filter(e -> !e.isDeleted())
                .toList();
        Map<Long, List<AttendanceRecord>> recordsByEmployee = attendanceRecordRepository.findAllNonDeleted()
                .stream()
                .collect(Collectors.groupingBy(
                        record -> record.getEmployee().getId(),
                        Collectors.mapping(Function.identity(), Collectors.toList())));
        return employees.stream()
                .map(employee -> buildSummary(
                        employee,
                        recordsByEmployee.getOrDefault(employee.getId(), List.of()),
                        year,
                        month))
                .toList();
    }

    @Override
    public AttendanceSummaryResponse summarizeMy(Integer year, Integer month) {
        Long employeeId = resolveCurrentEmployeeId();
        log.info("Summarize my attendance: employeeId={}, year={}, month={}", employeeId, year, month);
        return summarizeForEmployee(employeeId, year, month);
    }

    private AttendanceSummaryResponse buildSummary(Employee employee,
                                                   List<AttendanceRecord> records,
                                                   Integer year,
                                                   Integer month) {
        Map<AttendanceStatus, Long> counts = new EnumMap<>(AttendanceStatus.class);
        long present = 0;
        long absent = 0;
        long halfDay = 0;
        long onLeave = 0;
        long workFromHome = 0;
        long holiday = 0;

        for (AttendanceRecord record : records) {
            if (!matchesPeriod(record.getWorkDate(), year, month)) {
                continue;
            }
            counts.merge(record.getStatus(), 1L, Long::sum);
            switch (record.getStatus()) {
                case PRESENT -> present++;
                case ABSENT -> absent++;
                case HALF_DAY -> halfDay++;
                case ON_LEAVE -> onLeave++;
                case WORK_FROM_HOME -> workFromHome++;
                case HOLIDAY -> holiday++;
            }
        }

        long totalMarked = counts.values().stream().mapToLong(Long::longValue).sum();
        List<AttendanceStatusCount> breakdown = new ArrayList<>();
        for (AttendanceStatus status : AttendanceStatus.values()) {
            breakdown.add(new AttendanceStatusCount(status.name(), counts.getOrDefault(status, 0L)));
        }

        return new AttendanceSummaryResponse(
                employee.getId(),
                employee.getFirstName() + " " + employee.getLastName(),
                employee.getEmail(),
                year,
                month,
                present,
                absent,
                halfDay,
                onLeave,
                workFromHome,
                holiday,
                totalMarked,
                breakdown
        );
    }

    private boolean matchesPeriod(LocalDate workDate, Integer year, Integer month) {
        if (year == null && month == null) {
            return true;
        }
        if (year != null && workDate.getYear() != year) {
            return false;
        }
        if (month != null && workDate.getMonthValue() != month) {
            return false;
        }
        return true;
    }

    private Long resolveCurrentEmployeeId() {
        Long userId = SecurityUtils.getCurrentUserId();
        return employeeRepository.findByUserProfileId(userId)
                .map(Employee::getId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No employee linked to current user. Link a user account to an employee first."));
    }
}
