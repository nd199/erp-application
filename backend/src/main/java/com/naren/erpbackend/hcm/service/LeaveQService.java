package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.LeaveResponse;
import com.naren.erpbackend.hcm.entity.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface LeaveQService {

    LeaveResponse findLeaveById(Long id);

    Page<LeaveResponse> findAllLeaves(Pageable pageable);

    Page<LeaveResponse> findLeavesByEmployee(Long employeeId, Pageable pageable);

    Page<LeaveResponse> findMyLeaves(Pageable pageable);

    Page<LeaveResponse> findLeavesByStatus(LeaveStatus status, Pageable pageable);

    Page<LeaveResponse> searchLeaves(String keyword, Pageable pageable);
}
