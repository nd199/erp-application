package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.hcm.dto.PayslipResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
public interface PayslipQService {

    List<PayslipResponse> findPayslipsForRun(Long payrollRunId);

    PayslipResponse findPayslipForRunEmployee(Long payrollRunId, Long employeeId);

    List<PayslipResponse> findMyPayslips(Integer year);
}
