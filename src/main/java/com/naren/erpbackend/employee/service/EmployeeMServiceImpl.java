package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.EmployeeRequest;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import com.naren.erpbackend.employee.dto.EmployeeResponseMapper;
import com.naren.erpbackend.employee.entity.Department;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.DepartmentRepository;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeMServiceImpl implements EmployeeMService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserProfileRepository userProfileRepository;
    private final EmployeeResponseMapper employeeResponseMapper;

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        log.info("Create employee: email={}", request.email());

        if (employeeRepository.existsByEmailAndDeletedFalse(request.email().trim())) {
            throw new ResourceExistsException("Employee already exists with email: " + request.email());
        }

        try {
            Department department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.departmentId()));

            UserProfile userProfile = null;
            if (request.userProfileId() != null) {
                userProfile = userProfileRepository.findById(request.userProfileId())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userProfileId()));
            }

            Employee employee = Employee.builder()
                    .firstName(request.firstName().trim())
                    .lastName(request.lastName().trim())
                    .email(request.email().trim().toLowerCase())
                    .phone(request.phone().trim())
                    .hireDate(request.hireDate())
                    .jobTitle(request.jobTitle().trim())
                    .department(department)
                    .userProfile(userProfile)
                    .build();

            Employee saved = employeeRepository.save(employee);
            log.info("Employee created: id={}, name={} {}", saved.getId(), saved.getFirstName(), saved.getLastName());
            return employeeResponseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Employee already exists with email: " + request.email());
        }
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        log.info("Update employee: id={}", id);

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.departmentId()));

        employee.setFirstName(request.firstName().trim());
        employee.setLastName(request.lastName().trim());
        employee.setEmail(request.email().trim().toLowerCase());
        employee.setPhone(request.phone().trim());
        employee.setHireDate(request.hireDate());
        employee.setJobTitle(request.jobTitle().trim());
        employee.setDepartment(department);

        if (request.userProfileId() != null) {
            UserProfile userProfile = userProfileRepository.findById(request.userProfileId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.userProfileId()));
            employee.setUserProfile(userProfile);
        }

        Employee saved = employeeRepository.save(employee);
        log.info("Employee updated: id={}, name={} {}", saved.getId(), saved.getFirstName(), saved.getLastName());
        return employeeResponseMapper.apply(saved);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        log.info("Delete employee: id={}", id);

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setDeleted(true);
        employee.setStatus(UserStatus.INACTIVE);
        employeeRepository.save(employee);
        log.info("Employee soft-deleted: id={}", id);
    }
}
