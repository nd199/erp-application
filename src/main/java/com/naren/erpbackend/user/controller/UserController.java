package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.*;
import com.naren.erpbackend.user.service.RoleService;
import com.naren.erpbackend.user.service.UserMService;
import com.naren.erpbackend.user.service.UserQService;
import com.naren.erpbackend.user.service.UserStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserMService userMService;

    private final UserQService userQService;

    private final UserStatusService userStatusService;

    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<RegResponse> createUser(@Valid @RequestBody RegRequest regRequest) {
        log.info("Create user requested: username={}, email={}", regRequest.username(), regRequest.email());
        RegResponse userProfile = userMService.registerUser(regRequest);
        log.info("User created: username={}, status={}, created_at={}",
                userProfile.username(), userProfile.status(), userProfile.created_at());
        return ResponseEntity.status(CREATED).body(userProfile);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") Long id) {
        log.info("Fetch user requested: id={}", id);
        UserResponse userResponse = userQService.fetchUserById(id);
        log.info("User fetched: id={}, username={}", userResponse.id(), userResponse.username());
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable("username") String username) {
        log.info("Fetch user requested: username={}", username);
        UserResponse response = userQService.fetchUserByUsername(username);
        log.info("User fetched: id={}, username={}", response.id(), response.username());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable("email") String email) {
        log.info("Fetch user requested: email={}", email);
        UserResponse response = userQService.fetchUserByEmail(email);
        log.info("User fetched: id={}, email={}", response.id(), response.email());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
        log.info("Fetch all users requested: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<UserResponse> page = userQService.findAllUsers(pageable);
        log.info("Users page fetched: elements={}, total={}", page.getNumberOfElements(), page.getTotalElements());
        return ResponseEntity.ok(page);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search users requested: keyword={}, page={}, size={}",
                keyword, pageable.getPageNumber(), pageable.getPageSize());
        Page<UserResponse> page = userQService.searchUsers(keyword, pageable);
        log.info("User search completed: keyword={}, matches={}", keyword, page.getNumberOfElements());
        return ResponseEntity.ok(page);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable("id") Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        log.info("Update user requested: id={}, fields={}", id, request != null ? "present" : "null");
        UserResponse userResponse = userMService.updateUser(id, request);
        log.info("User updated: id={}, username={}, last_updated={}",
                userResponse.id(), userResponse.username(), userResponse.last_updated());
        return ResponseEntity.ok(userResponse);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable("id") Long id,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        log.info("Change password requested: userId={}", id);
        userMService.changePassword(id, changePasswordRequest);
        log.info("Password changed: userId={}", id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<UserResponse> activateUser(@PathVariable Long id) {
        log.info("Activate user requested: id={}", id);
        UserResponse response = userStatusService.activateUser(id);
        log.info("User activated: id={}, status={}", response.id(), response.status());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserResponse> deactivateUser(@PathVariable Long id) {
        log.info("Deactivate user requested: id={}", id);
        UserResponse response = userStatusService.deactivateUser(id);
        log.info("User deactivated: id={}, status={}", response.id(), response.status());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<Void> lockUser(@PathVariable Long id) {
        log.info("Lock user requested: id={}", id);
        userStatusService.lockUser(id);
        log.info("User locked: id={}", id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/unlock")
    public ResponseEntity<Void> unLockUser(@PathVariable Long id) {
        log.info("Unlock user requested: id={}", id);
        userStatusService.unlockUser(id);
        log.info("User unlocked: id={}", id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<Void> assignRoleToUser(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        log.info("Assign role requested: userId={}, roleId={}", userId, roleId);
        roleService.assignRoleToUser(userId, roleId);
        log.info("Role assigned: userId={}, roleId={}", userId, roleId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/roles/{roleId}")
    public ResponseEntity<Void> removeRoleFromUser(
            @PathVariable Long userId,
            @PathVariable Long roleId) {
        log.info("Remove role requested: userId={}, roleId={}", userId, roleId);
        roleService.removeRoleFromUser(userId, roleId);
        log.info("Role removed: userId={}, roleId={}", userId, roleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/roles")
    public ResponseEntity<Set<RoleResponse>> getRolesByUser(@PathVariable("userId") Long userId) {
        log.info("Fetch user roles requested: userId={}", userId);
        Set<RoleResponse> roles = userQService.findRolesByUser(userId);
        log.info("User roles fetched: userId={}, count={}", userId, roles.size());
        return ResponseEntity.ok(roles);
    }
}