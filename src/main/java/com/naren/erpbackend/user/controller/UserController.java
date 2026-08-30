package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.*;
import com.naren.erpbackend.user.service.UserMService;
import com.naren.erpbackend.user.service.UserQService;
import com.naren.erpbackend.user.service.UserStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    private final UserMService userMService;

    private final UserQService userQService;

    private final UserStatusService userStatusService;

    @PostMapping
    public ResponseEntity<RegResponse> createUser(@Valid @RequestBody RegRequest regRequest) {
        logger.info("Creating user with username: {}", regRequest.username());
        RegResponse userProfile = userMService.registerUser(regRequest);
        logger.info("User created successfully with id: {}", userProfile.username());
        return ResponseEntity
                .status(CREATED)
                .body(userProfile);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") Long id) {
        logger.info("Fetching user by id: {}", id);
        UserResponse userResponse = userQService.fetchUserById(id);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable("username") String username) {
        logger.info("Fetching user by username: {}", username);
        UserResponse response = userQService.fetchUserByUsername(username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable("email") String email) {
        logger.info("Fetching user by email: {}", email);
        UserResponse response = userQService.fetchUserByEmail(email);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
        logger.info("Fetching all users with pagination");
        return ResponseEntity.ok(userQService.findAllUsers(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        logger.info("Searching users with keyword: {}", keyword);
        return ResponseEntity.ok(userQService.searchUsers(keyword, pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable("id") Long id,
            @Valid @RequestBody UserUpdateRequest request
    ) {
        logger.info("Updating user with id: {}", id);
        UserResponse userResponse = userMService.updateUser(id, request);
        return ResponseEntity.ok(userResponse);
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable("id") Long id,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        logger.info("Changing password for user id: {}", id);
        userMService.changePassword(id, changePasswordRequest);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<UserResponse> activateUser(
            @PathVariable Long id) {
        logger.info("Activating user with id: {}", id);
        return ResponseEntity.ok(
                userStatusService.activateUser(id)
        );
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserResponse> deactivateUser(
            @PathVariable Long id) {
        logger.info("Deactivating user with id: {}", id);
        return ResponseEntity.ok(
                userStatusService.deactivateUser(id)
        );
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<Void> lockUser(
            @PathVariable Long id) {
        logger.info("Locking user with id: {}", id);
        userStatusService.lockUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/unlock")
    public ResponseEntity<Void> unLockUser(
            @PathVariable Long id) {
        logger.info("Unlocking user with id: {}", id);
        userStatusService.unlockUser(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{userId}/roles")
    public ResponseEntity<Set<RoleResponse>> getRolesByUser(
            @PathVariable("userId") Long userId) {
        logger.info("Fetching roles for user with id: {}", userId);

        return ResponseEntity
                .ok(userQService.findRolesByUser(userId));
    }
}
