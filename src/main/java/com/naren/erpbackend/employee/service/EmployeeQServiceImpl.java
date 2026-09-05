package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import com.naren.erpbackend.employee.dto.EmployeeResponseMapper;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeQServiceImpl implements EmployeeQService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeResponseMapper employeeResponseMapper;

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse findEmployeeById(Long id) {
        log.info("Fetch employee: id={}", id);
        Employee employee = employeeRepository.findById(id)
                .filter(e -> !e.isDeleted())
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Employee not found with id: " + id)
                );
        return employeeResponseMapper.apply(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse findEmployeeByEmail(String email) {
        log.info("Fetch employee: email={}", email);
        Employee employee = employeeRepository
                .findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with email: " + email)
                );
        return employeeResponseMapper.apply(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> findAllEmployees(Pageable pageable) {
        log.info("Fetch all employees: page={}, size={}", pageable.getPageNumber(),
                pageable.getPageSize());
        return employeeRepository
                .findAllNonDeleted(pageable)
                .map(employeeResponseMapper);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<EmployeeResponse> searchEmployees(String keyword, Pageable pageable) {
        log.info("Search employees: keyword={}", keyword);
        return employeeRepository
                .searchEmployees(keyword, pageable)
                .map(employeeResponseMapper);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponse> findEmployeesByDepartment(Long departmentId, Pageable pageable) {
        log.info("Fetch employees by department: departmentId={}", departmentId);
        return employeeRepository
                .findByDepartmentId(departmentId, pageable).
                map(employeeResponseMapper);
    }
}