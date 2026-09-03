package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.service.RoleQService;
import com.naren.erpbackend.user.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/roles")
@Slf4j
public class RoleController {

    private final RoleService roleService;
    private final RoleQService roleQService;

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
        Set<PermissionResponse> permissionsByRole = roleService.findPermissionsByRole(roleId);
        log.info("Role permissions fetched: roleId={}, count={}", roleId, permissionsByRole.size());
        return ResponseEntity.ok(permissionsByRole);
    }

    @GetMapping("/{roleId}/users")
    public ResponseEntity<Set<UserResponse>> getUsersByRole(@PathVariable Long roleId) {
        log.info("Fetch users for role requested: roleId={}", roleId);
        Set<UserResponse> users = roleQService.findUsersByRole(roleId);
        log.info("Role users fetched: roleId={}, count={}", roleId, users.size());
        return ResponseEntity.ok(users);
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
}