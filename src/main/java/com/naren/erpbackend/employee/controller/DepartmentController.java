package com.naren.erpbackend.employee.controller;

import com.naren.erpbackend.employee.dto.DepartmentRequest;
import com.naren.erpbackend.employee.dto.DepartmentResponse;
import com.naren.erpbackend.employee.service.DepartmentMService;
import com.naren.erpbackend.employee.service.DepartmentQService;
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
@RequestMapping("/api/v1/departments")
public class DepartmentController {

    private final DepartmentMService departmentMService;
    private final DepartmentQService departmentQService;

    @PostMapping
    public ResponseEntity<DepartmentResponse> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {
        log.info("Create department: name={}", request.name());
        DepartmentResponse response = departmentMService.createDepartment(request);
        log.info("Department created: id={}, name={}", response.id(), response.name());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        log.info("Fetch department: id={}", id);
        DepartmentResponse response = departmentQService.findDepartmentById(id);
        log.info("Department fetched: id={}, name={}", response.id(), response.name());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<DepartmentResponse>> getAllDepartments(Pageable pageable) {
        log.info("Fetch all departments: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(departmentQService.findAllDepartments(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<DepartmentResponse>> searchDepartments(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search departments: keyword={}", keyword);
        return ResponseEntity.ok(departmentQService.searchDepartments(keyword, pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DepartmentResponse> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {
        log.info("Update department: id={}", id);
        DepartmentResponse response = departmentMService.updateDepartment(id, request);
        log.info("Department updated: id={}, name={}", response.id(), response.name());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        log.info("Delete department: id={}", id);
        departmentMService.deleteDepartment(id);
        log.info("Department deleted: id={}", id);
        return ResponseEntity.noContent().build();
    }
}
