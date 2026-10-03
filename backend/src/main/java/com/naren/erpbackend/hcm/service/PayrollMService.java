package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.PayrollRunRequestDto;
import com.naren.erpbackend.hcm.dto.PayrollRunResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface PayrollMService {

    PayrollRunResponse createPayrollRun(PayrollRunRequestDto request);

    PayrollRunResponse updatePayrollRun(Long id, PayrollRunRequestDto request);

    PayrollRunResponse processPayrollRun(Long id);

    PayrollRunResponse markAsPaid(Long id);

    void deletePayrollRun(Long id);
}
