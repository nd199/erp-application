package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.service.PermissionQService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/permissions")
@Slf4j
public class PermissionController {

    private final PermissionQService permissionQService;

    @GetMapping("/{id}")
    public ResponseEntity<PermissionResponse> getPermissionById(@PathVariable Long id) {
        log.info("Fetch permission requested: id={}", id);
        PermissionResponse response = permissionQService.findPermissionById(id);
        log.info("Permission fetched: id={}, name={}", response.id(), response.name());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<PermissionResponse>> getAllPermissions(Pageable pageable) {
        log.info("Fetch all permissions requested: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<PermissionResponse> page = permissionQService.findAllPermissions(pageable);
        log.info("All permissions fetched: elements={}, total={}", page.getNumberOfElements(), page.getTotalElements());
        return ResponseEntity.ok(page);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PermissionResponse>> searchPermissions(
            @RequestParam String keyword,
            Pageable pageable) {
        log.info("Search permissions requested: keyword={}, page={}, size={}", keyword, pageable.getPageNumber(), pageable.getPageSize());
        Page<PermissionResponse> page = permissionQService.searchPermissions(keyword, pageable);
        log.info("Permission search completed: keyword={}, matches={}", keyword, page.getNumberOfElements());
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{permissionId}/roles")
    public ResponseEntity<Set<RoleResponse>> getRolesByPermission(@PathVariable Long permissionId) {
        log.info("Fetch roles for permission requested: permissionId={}", permissionId);
        Set<RoleResponse> roles = permissionQService.findRolesByPermission(permissionId);
        log.info("Permission roles fetched: permissionId={}, count={}", permissionId, roles.size());
        return ResponseEntity.ok(roles);
    }
}