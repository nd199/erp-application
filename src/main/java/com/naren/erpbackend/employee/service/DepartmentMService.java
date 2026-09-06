package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.employee.dto.DepartmentRequest;
import com.naren.erpbackend.employee.dto.DepartmentResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface DepartmentMService {

    DepartmentResponse createDepartment(DepartmentRequest request);

    DepartmentResponse updateDepartment(Long id, DepartmentRequest request);

    void deleteDepartment(Long id);

}
