package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.employee.dto.EmployeeRequest;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface EmployeeMService {

    EmployeeResponse createEmployee(EmployeeRequest request);

    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);

    void deleteEmployee(Long id);
}
