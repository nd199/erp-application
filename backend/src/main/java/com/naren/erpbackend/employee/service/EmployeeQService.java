package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.employee.dto.EmployeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface EmployeeQService {

    EmployeeResponse findEmployeeById(Long id);

    EmployeeResponse findEmployeeByEmail(String email);

    Page<EmployeeResponse> findAllEmployees(Pageable pageable);

    Page<EmployeeResponse> searchEmployees(String keyword, Pageable pageable);

    Page<EmployeeResponse> findEmployeesByDepartment(Long departmentId, Pageable pageable);
}
