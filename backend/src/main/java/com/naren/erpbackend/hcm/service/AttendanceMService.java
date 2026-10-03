package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.AttendanceRequestDto;
import com.naren.erpbackend.hcm.dto.AttendanceResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface AttendanceMService {

    AttendanceResponse markAttendance(AttendanceRequestDto request);

    AttendanceResponse updateAttendance(Long id, AttendanceRequestDto request);

    void deleteAttendance(Long id);
}
