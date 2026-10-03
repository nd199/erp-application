package com.naren.erpbackend.employee.controller;

import com.naren.erpbackend.employee.dto.EmployeeRequest;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import com.naren.erpbackend.employee.dto.OrgChartNode;
import com.naren.erpbackend.employee.service.EmployeeMService;
import com.naren.erpbackend.employee.service.EmployeeQService;
import com.naren.erpbackend.user.entity.UserStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeMService employeeMService;
    private final EmployeeQService employeeQService;

    @PostMapping
    @PreAuthorize("hasAuthority('EMPLOYEE_CREATE')")
    public ResponseEntity<EmployeeResponse> createEmployee(
            @Valid @RequestBody EmployeeRequest request) {
        log.info("Create employee: email={}", request.email());
        EmployeeResponse response = employeeMService.createEmployee(request);
        log.info("Employee created: id={}, name={} {}", response.id(), response.firstName(), response.lastName());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/org-chart")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<List<OrgChartNode>> getOrgChart() {
        log.info("Fetch org chart");
        return ResponseEntity.ok(employeeQService.findOrgChart());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        log.info("Fetch employee: id={}", id);
        EmployeeResponse response = employeeQService.findEmployeeById(id);
        log.info("Employee fetched: id={}, name={} {}", response.id(), response.firstName(), response.lastName());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long departmentId,
            Pageable pageable) {
        log.info("Fetch employees: search={}, status={}, departmentId={}, page={}, size={}",
                search, status, departmentId, pageable.getPageNumber(), pageable.getPageSize());
        UserStatus userStatus = (status == null || status.isBlank())
                ? null
                : UserStatus.valueOf(status.trim().toUpperCase());
        return ResponseEntity.ok(employeeQService.filterEmployees(search, userStatus, departmentId, pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<Page<EmployeeResponse>> searchEmployees(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search employees: keyword={}", keyword);
        return ResponseEntity.ok(employeeQService.searchEmployees(keyword, pageable));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<Page<EmployeeResponse>> getEmployeesByDepartment(
            @PathVariable Long departmentId, Pageable pageable) {
        log.info("Fetch employees by department: departmentId={}", departmentId);
        return ResponseEntity.ok(employeeQService.findEmployeesByDepartment(departmentId, pageable));
    }

    @GetMapping("/manager/{managerId}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<Page<EmployeeResponse>> getEmployeesByManager(
            @PathVariable Long managerId, Pageable pageable) {
        log.info("Fetch employees by manager: managerId={}", managerId);
        return ResponseEntity.ok(employeeQService.findEmployeesByManager(managerId, pageable));
    }

    @GetMapping("/manager/{managerId}/direct-reports")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<java.util.List<EmployeeResponse>> getDirectReports(
            @PathVariable Long managerId) {
        log.info("Fetch direct reports: managerId={}", managerId);
        return ResponseEntity.ok(employeeQService.findDirectReports(managerId));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE')")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequest request) {
        log.info("Update employee: id={}", id);
        EmployeeResponse response = employeeMService.updateEmployee(id, request);
        log.info("Employee updated: id={}, name={} {}", response.id(), response.firstName(), response.lastName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_DELETE')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.info("Delete employee: id={}", id);
        employeeMService.deleteEmployee(id);
        log.info("Employee deleted: id={}", id);
        return ResponseEntity.noContent().build();
    }
}
