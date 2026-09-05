package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.DepartmentResponse;
import com.naren.erpbackend.employee.dto.DepartmentResponseMapper;
import com.naren.erpbackend.employee.entity.Department;
import com.naren.erpbackend.employee.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentQServiceImpl implements DepartmentQService {

    private final DepartmentRepository departmentRepository;

    private final DepartmentResponseMapper responseMapper;

    @Override
    public DepartmentResponse findDepartmentById(Long id) {
        log.info("Fetch department: id={}", id);

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + id)
                );

        return responseMapper.apply(department);
    }

    @Override
    public Page<DepartmentResponse> findAllDepartments(Pageable pageable) {
        log.info("Fetch all departments: pageable={}", pageable);

        return departmentRepository
                .findAll(pageable)
                .map(responseMapper);
    }

    @Override
    public Page<DepartmentResponse> searchDepartments(String keyword, Pageable pageable) {
        log.info("Search departments: keyword={}, pageable={}", keyword, pageable);

        return departmentRepository
                .searchDepartments(keyword, pageable)
                .map(responseMapper);
    }
}
