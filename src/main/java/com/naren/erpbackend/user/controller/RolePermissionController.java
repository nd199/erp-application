package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.service.RolePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RolePermissionController {

    private final RolePermissionService rolePermissionService;

    @PostMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Void> assignPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {

        rolePermissionService.assignPermission(roleId, permissionId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Void> removePermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {

        rolePermissionService.removePermission(roleId, permissionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<Set<PermissionResponse>> getRolePermissions(
            @PathVariable Long roleId) {

        return ResponseEntity.ok(
                rolePermissionService.getRolePermissions(roleId)
        );
    }

    @GetMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Boolean> hasPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {

        return ResponseEntity.ok(
                rolePermissionService.hasPermission(roleId, permissionId)
        );
    }
}