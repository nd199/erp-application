package com.naren.erpbackend.hcm.controller;

import com.naren.erpbackend.hcm.dto.AttendanceRequestDto;
import com.naren.erpbackend.hcm.dto.AttendanceResponse;
import com.naren.erpbackend.hcm.dto.AttendanceSummaryResponse;
import com.naren.erpbackend.hcm.entity.AttendanceStatus;
import com.naren.erpbackend.hcm.service.AttendanceMService;
import com.naren.erpbackend.hcm.service.AttendanceQService;
import com.naren.erpbackend.hcm.service.AttendanceSummaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceMService attendanceMService;
    private final AttendanceQService attendanceQService;
    private final AttendanceSummaryService attendanceSummaryService;

    @PostMapping
    @PreAuthorize("hasAuthority('ATTENDANCE_CREATE')")
    public ResponseEntity<AttendanceResponse> markAttendance(@Valid @RequestBody AttendanceRequestDto request) {
        log.info("Mark attendance: employeeId={}, date={}", request.employeeId(), request.workDate());
        AttendanceResponse response = attendanceMService.markAttendance(request);
        log.info("Attendance marked: id={}, employeeId={}", response.id(), response.employeeId());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<AttendanceResponse> getAttendanceById(@PathVariable Long id) {
        log.info("Fetch attendance: id={}", id);
        return ResponseEntity.ok(attendanceQService.findAttendanceById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<Page<AttendanceResponse>> getAllAttendance(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        log.info("Fetch attendance: employeeId={}, date={}, status={}, from={}, to={}",
                employeeId, date, status, fromDate, toDate);

        if (employeeId != null && fromDate != null && toDate != null) {
            return ResponseEntity.ok(attendanceQService.findAttendanceByEmployeeAndRange(
                    employeeId, fromDate, toDate, pageable));
        }
        if (employeeId != null) {
            return ResponseEntity.ok(attendanceQService.findAttendanceByEmployee(employeeId, pageable));
        }
        if (date != null) {
            return ResponseEntity.ok(attendanceQService.findAttendanceByDate(date, pageable));
        }
        if (status != null && !status.isBlank()) {
            AttendanceStatus attendanceStatus = AttendanceStatus.valueOf(status.trim().toUpperCase());
            return ResponseEntity.ok(attendanceQService.findAttendanceByStatus(attendanceStatus, pageable));
        }
        return ResponseEntity.ok(attendanceQService.findAllAttendance(pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<Page<AttendanceResponse>> getMyAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            Pageable pageable) {
        log.info("Fetch my attendance: from={}, to={}", fromDate, toDate);
        return ResponseEntity.ok(attendanceQService.findMyAttendance(fromDate, toDate, pageable));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<?> getAttendanceSummary(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        log.info("Attendance summary: employeeId={}, year={}, month={}", employeeId, year, month);
        if (employeeId != null) {
            return ResponseEntity.ok(attendanceSummaryService.summarizeForEmployee(employeeId, year, month));
        }
        List<AttendanceSummaryResponse> summaries = attendanceSummaryService.summarizeAll(year, month);
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/summary/my")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<AttendanceSummaryResponse> getMyAttendanceSummary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        log.info("My attendance summary: year={}, month={}", year, month);
        return ResponseEntity.ok(attendanceSummaryService.summarizeMy(year, month));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ATTENDANCE_READ')")
    public ResponseEntity<Page<AttendanceResponse>> searchAttendance(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search attendance: keyword={}", keyword);
        return ResponseEntity.ok(attendanceQService.searchAttendance(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ATTENDANCE_UPDATE')")
    public ResponseEntity<AttendanceResponse> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequestDto request) {
        log.info("Update attendance: id={}", id);
        return ResponseEntity.ok(attendanceMService.updateAttendance(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ATTENDANCE_DELETE')")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        log.info("Delete attendance: id={}", id);
        attendanceMService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
