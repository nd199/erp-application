package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.CreateRoleRequest;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/roles")
@Slf4j
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<RoleResponse> createRole(
            @Valid @RequestBody CreateRoleRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roleService.createRole(
                        request.name(),
                        request.description()
                ));
    }

    @PostMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Void> addPermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {

        roleService.addPermission(roleId, permissionId);

        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Void> removePermission(
            @PathVariable Long roleId,
            @PathVariable Long permissionId) {

        roleService.removePermission(roleId, permissionId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roleId}/permissions")
    public ResponseEntity<Set<PermissionResponse>> getPermissions(
            @PathVariable Long roleId) {

        Set<PermissionResponse> permissionsByRole =
                roleService.findPermissionsByRole(roleId);

        return ResponseEntity.ok(permissionsByRole);
    }

    @PostMapping("/{id}/roles/{roleId}")
    public ResponseEntity<Void> assignRoleToUser(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        log.info("Assigning role to user with id: {} and role id: {}", userId, roleId);

        roleService.assignRoleToUser(userId, roleId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/roles/{roleId}")
    public ResponseEntity<Void> removeRoleFromUser(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        log.info("Removing role from user with id: {} and role id: {}", userId, roleId);

        roleService.removeRoleFromUser(userId, roleId);

        return ResponseEntity.noContent().build();
    }
}
