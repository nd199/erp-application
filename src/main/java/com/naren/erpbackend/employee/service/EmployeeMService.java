package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.employee.dto.EmployeeRequest;
import com.naren.erpbackend.employee.dto.EmployeeResponse;

public interface EmployeeMService {

    EmployeeResponse createEmployee(EmployeeRequest request);

    EmployeeResponse updateEmployee(Long id, EmployeeRequest request);

    void deleteEmployee(Long id);
}
