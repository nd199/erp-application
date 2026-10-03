package com.naren.erpbackend.hcm.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.hcm.dto.PayrollRunResponse;
import com.naren.erpbackend.hcm.dto.PayrollRunResponseMapper;
import com.naren.erpbackend.hcm.entity.PayrollRun;
import com.naren.erpbackend.hcm.entity.PayrollStatus;
import com.naren.erpbackend.hcm.repository.PayrollRunRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayrollQServiceImpl implements PayrollQService {

    private final PayrollRunRepository payrollRunRepository;
    private final PayrollRunResponseMapper responseMapper;

    @Override
    public PayrollRunResponse findPayrollRunById(Long id) {
        log.info("Fetch payroll run: id={}", id);
        PayrollRun run = payrollRunRepository.findById(id)
                .filter(r -> !r.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Payroll run not found with id: " + id));
        return responseMapper.apply(run);
    }

    @Override
    public Page<PayrollRunResponse> findAllPayrollRuns(Pageable pageable) {
        log.info("Fetch all payroll runs: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return payrollRunRepository.findAllNonDeleted(pageable).map(responseMapper);
    }

    @Override
    public Page<PayrollRunResponse> findPayrollRunsByStatus(PayrollStatus status, Pageable pageable) {
        log.info("Fetch payroll runs by status: status={}", status);
        return payrollRunRepository.findByStatus(status, pageable).map(responseMapper);
    }

    @Override
    public Page<PayrollRunResponse> findPayrollRunsByYear(Integer year, Pageable pageable) {
        log.info("Fetch payroll runs by year: year={}", year);
        return payrollRunRepository.findByYear(year, pageable).map(responseMapper);
    }

    @Override
    public Page<PayrollRunResponse> searchPayrollRuns(String keyword, Pageable pageable) {
        log.info("Search payroll runs: keyword={}", keyword);
        Integer yearParam = null;
        if (keyword != null && keyword.trim().matches("\\d{4}")) {
            yearParam = Integer.parseInt(keyword.trim());
        }
        return payrollRunRepository.searchPayrollRuns(keyword == null ? "" : keyword, yearParam, pageable)
                .map(responseMapper);
    }
}
