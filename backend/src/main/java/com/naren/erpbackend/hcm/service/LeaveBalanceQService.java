package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.LeaveBalanceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface LeaveBalanceQService {

    LeaveBalanceResponse findLeaveBalanceById(Long id);

    Page<LeaveBalanceResponse> findAllLeaveBalances(Long employeeId, Integer year, Pageable pageable);

    Page<LeaveBalanceResponse> findMyLeaveBalances(Integer year, Pageable pageable);
}
