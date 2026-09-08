package com.naren.erpbackend.employee.dto;

import com.naren.erpbackend.employee.entity.Employee;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class EmployeeResponseMapper implements Function<Employee, EmployeeResponse> {

    @Override
    public EmployeeResponse apply(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getHireDate(),
                employee.getJobTitle(),
                employee.getDepartment().getId(),
                employee.getDepartment().getName(),
                employee.getUserProfile() != null ? employee.getUserProfile().getId() : null,
                employee.getStatus(),
                employee.getCreatedAt(),
                employee.getLastUpdated()
        );
    }
}