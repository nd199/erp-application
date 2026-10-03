package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.LeaveRequestDto;
import com.naren.erpbackend.hcm.dto.LeaveResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface LeaveMService {

    LeaveResponse createLeave(LeaveRequestDto request);

    LeaveResponse updateLeave(Long id, LeaveRequestDto request);

    LeaveResponse approveOrReject(Long id, String status, String approvalNotes);

    void deleteLeave(Long id);
}
