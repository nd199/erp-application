package com.naren.erpbackend.employee.dto;

import com.naren.erpbackend.employee.entity.Department;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class DepartmentResponseMapper implements Function<Department, DepartmentResponse> {

    @Override
    public DepartmentResponse apply(Department department) {
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getCreatedAt(),
                department.getLastUpdated()
        );
    }
}