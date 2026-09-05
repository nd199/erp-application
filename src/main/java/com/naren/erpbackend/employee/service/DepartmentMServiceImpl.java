package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.DepartmentRequest;
import com.naren.erpbackend.employee.dto.DepartmentResponse;
import com.naren.erpbackend.employee.dto.DepartmentResponseMapper;
import com.naren.erpbackend.employee.entity.Department;
import com.naren.erpbackend.employee.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DepartmentMServiceImpl implements DepartmentMService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentResponseMapper responseMapper;

    @Override
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        log.info("Creating department: name={}", request.name());

        if (departmentRepository.existsByName(request.name().trim())) {
            throw new ResourceExistsException(
                    "Department with name " + request.name() + " taken"
            );
        }

        try {
            Department department = Department
                    .builder()
                    .name(request.name().trim())
                    .description(request.description() != null ? request.description().trim()
                            : null)
                    .build();
            Department saved = departmentRepository.save(department);
            log.info("Department created: id={}, name={}", saved.getId(), saved.getName());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            log.warn("Create department rejected by unique constraint: name={}", request.name());
            throw new ResourceExistsException("Department with name " + request.name()
                    + " taken", e);
        }
    }

    @Override
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        log.info("Update department: id={}", id);

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + id)
                );

        department.setName(request.name().trim());
        department.setDescription(request.description() != null ?
                request.description().trim() : null);

        try {
            Department saved = departmentRepository.save(department);
            log.info("Department updated: id={}, name={}", saved.getId(), saved.getName());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            log.warn("Update department rejected by unique constraint: id={}, name={}", id, request.name());
            throw new ResourceExistsException("Department with name " + request.name()
                    + " taken", e);
        }
    }

    @Override
    public void deleteDepartment(Long id) {
        log.info("Delete department: id={}", id);

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + id)
                );

        try {
            departmentRepository.delete(department);
        } catch (DataIntegrityViolationException e) {
            log.warn("Delete department rejected by constraint violation: id={}", id);
            throw new ResourceExistsException("Department cannot be deleted due to existing references", e);
        }

        log.info("Department deleted: id={}", id);
    }
}
