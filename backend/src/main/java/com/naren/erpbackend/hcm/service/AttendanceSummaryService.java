package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.AttendanceSummaryResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
public interface AttendanceSummaryService {

    AttendanceSummaryResponse summarizeForEmployee(Long employeeId, Integer year, Integer month);

    List<AttendanceSummaryResponse> summarizeAll(Integer year, Integer month);

    AttendanceSummaryResponse summarizeMy(Integer year, Integer month);
}
