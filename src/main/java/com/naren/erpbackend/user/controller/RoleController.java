package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.*;
import com.naren.erpbackend.user.service.PermissionService;
import com.naren.erpbackend.user.service.RoleQService;
import com.naren.erpbackend.user.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/roles")
@Slf4j
public class RoleController {

    private final RoleService roleService;
    private final RoleQService roleQService;
    private final PermissionService permissionService;

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody RoleRequest request) {
        log.info("Create role requested: name={}", request.name());
        RoleResponse response = roleService.createRole(request.name(), request.description());
        log.info("Role created: id={}, name={}", response.id(), response.name());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Long id) {
        log.info("Fetch role requested: id={}", id);
        RoleResponse response = roleQService.findRoleById(id);
        log.info("Role fetched: id={}, name={}", response.id(), response.name());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<RoleResponse>> getAllRoles(Pageable pageable) {
        log.info("Fetch all roles requested: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<RoleResponse> page = roleQService.findAllRoles(pageable);
        log.info("All roles fetched: elements={}, total={}", page.getNumberOfElements(), page.getTotalElements());
        return ResponseEntity.ok(page);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RoleResponse>> searchRoles(
            @RequestParam String keyword,
            Pageable pageable) {
        log.info("Search roles requested: keyword={}, page={}, size={}", keyword, pageable.getPageNumber(), pageable.getPageSize());
        Page<RoleResponse> page = roleQService.searchRoles(keyword, pageable);
        log.info("Role search completed: keyword={}, matches={}", keyword, page.getNumberOfElements());
        return ResponseEntity.ok(page);
    }

    @PostMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Void> addPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {
        log.info("Add permission to role requested: roleId={}, permissionId={}", roleId, permissionId);
        roleService.addPermission(roleId, permissionId);
        log.info("Permission added to role: roleId={}, permissionId={}", roleId, permissionId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Void> removePermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {
        log.info("Remove permission from role requested: roleId={}, permissionId={}", roleId, permissionId);
        roleService.removePermission(roleId, permissionId);
        log.info("Permission removed from role: roleId={}, permissionId={}", roleId, permissionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<Set<PermissionResponse>> getPermissions(@PathVariable Long roleId) {
        log.info("Fetch permissions for role requested: roleId={}", roleId);
        Set<PermissionResponse> permissions = roleService.findPermissionsByRole(roleId);
        log.info("Role permissions fetched: roleId={}, count={}", roleId, permissions.size());
        return ResponseEntity.ok(permissions);
    }

    @GetMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Boolean> hasPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {
        log.info("Check role permission requested: roleId={}, permissionId={}", roleId, permissionId);
        boolean hasPermission = roleService.hasPermission(roleId, permissionId);
        log.info("Role permission check: roleId={}, permissionId={}, hasPermission={}", roleId, permissionId, hasPermission);
        return ResponseEntity.ok(hasPermission);
    }

    @GetMapping("/{roleId}/users")
    public ResponseEntity<Set<UserResponse>> getUsersByRole(@PathVariable Long roleId) {
        log.info("Fetch users for role requested: roleId={}", roleId);
        Set<UserResponse> users = roleQService.findUsersByRole(roleId);
        log.info("Role users fetched: roleId={}, count={}", roleId, users.size());
        return ResponseEntity.ok(users);
    }
}
