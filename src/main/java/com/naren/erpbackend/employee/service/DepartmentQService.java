package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.employee.dto.DepartmentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DepartmentQService {

    DepartmentResponse findDepartmentById(Long id);

    Page<DepartmentResponse> findAllDepartments(Pageable pageable);

    Page<DepartmentResponse> searchDepartments(String keyword, Pageable pageable);
}
