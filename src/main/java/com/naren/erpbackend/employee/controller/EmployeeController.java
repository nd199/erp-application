package com.naren.erpbackend.employee.controller;

import com.naren.erpbackend.employee.dto.EmployeeRequest;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import com.naren.erpbackend.employee.service.EmployeeMService;
import com.naren.erpbackend.employee.service.EmployeeQService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeMService employeeMService;
    private final EmployeeQService employeeQService;

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        log.info("Create employee: email={}", request.email());
        EmployeeResponse response = employeeMService.createEmployee(request);
        log.info("Employee created: id={}, name={} {}", response.id(), response.firstName(), response.lastName());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        log.info("Fetch employee: id={}", id);
        EmployeeResponse response = employeeQService.findEmployeeById(id);
        log.info("Employee fetched: id={}, name={} {}", response.id(), response.firstName(), response.lastName());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployees(Pageable pageable) {
        log.info("Fetch all employees: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(employeeQService.findAllEmployees(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<EmployeeResponse>> searchEmployees(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search employees: keyword={}", keyword);
        return ResponseEntity.ok(employeeQService.searchEmployees(keyword, pageable));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<Page<EmployeeResponse>> getEmployeesByDepartment(
            @PathVariable Long departmentId, Pageable pageable) {
        log.info("Fetch employees by department: departmentId={}", departmentId);
        return ResponseEntity.ok(employeeQService.findEmployeesByDepartment(departmentId, pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        log.info("Update employee: id={}", id);
        EmployeeResponse response = employeeMService.updateEmployee(id, request);
        log.info("Employee updated: id={}, name={} {}", response.id(), response.firstName(), response.lastName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.info("Delete employee: id={}", id);
        employeeMService.deleteEmployee(id);
        log.info("Employee deleted: id={}", id);
        return ResponseEntity.noContent().build();
    }
}
