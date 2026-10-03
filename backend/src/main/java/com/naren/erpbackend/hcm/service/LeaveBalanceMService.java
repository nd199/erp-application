package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.LeaveBalanceRequest;
import com.naren.erpbackend.hcm.dto.LeaveBalanceResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface LeaveBalanceMService {

    LeaveBalanceResponse createLeaveBalance(LeaveBalanceRequest request);

    LeaveBalanceResponse updateLeaveBalance(Long id, LeaveBalanceRequest request);

    void deleteLeaveBalance(Long id);
}
