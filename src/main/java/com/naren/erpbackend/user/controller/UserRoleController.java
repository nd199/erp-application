package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.service.UserRoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/user-roles")
@Slf4j
@RequiredArgsConstructor
public class UserRoleController {

    private final UserRoleService userRoleService;


    @PostMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<Void> assignRole(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        userRoleService.assignRole(userId, roleId);
        log.info("Assigned role {} to user {}", roleId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<Void> removeRole(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        userRoleService.removeRole(userId, roleId);
        log.info("Removed role {} from user {}", roleId, userId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/{userId}/roles")
    public ResponseEntity<Set<RoleResponse>> getUserRoles(
            @PathVariable Long userId) {
        Set<RoleResponse> roles = userRoleService.getUserRoles(userId);
        log.info("Retrieved roles for user {}", userId);
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<RoleResponse> getUserRole(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        RoleResponse role = userRoleService.getUserRole(userId, roleId);
        log.info("Retrieved role {} for user {}", roleId, userId);
        return ResponseEntity.ok(role);
    }

    @GetMapping("/{userId}/roles/{roleId}/check")
    public ResponseEntity<Boolean> hasRole(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        log.info("Checked hasRole");
        return ResponseEntity.ok(userRoleService.hasRole(userId, roleId));
    }
}
