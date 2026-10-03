package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.PayrollRunResponse;
import com.naren.erpbackend.hcm.entity.PayrollStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface PayrollQService {

    PayrollRunResponse findPayrollRunById(Long id);

    Page<PayrollRunResponse> findAllPayrollRuns(Pageable pageable);

    Page<PayrollRunResponse> findPayrollRunsByStatus(PayrollStatus status, Pageable pageable);

    Page<PayrollRunResponse> findPayrollRunsByYear(Integer year, Pageable pageable);

    Page<PayrollRunResponse> searchPayrollRuns(String keyword, Pageable pageable);
}
