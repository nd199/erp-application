package com.naren.erpbackend.user.controller;

import com.naren.erpbackend.user.dto.ChangePasswordRequest;
import com.naren.erpbackend.user.service.PasswordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/password")
public class PasswordController {

    private final PasswordService passwordService;

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_CHANGE_PASSWORD')")
    public ResponseEntity<Void> changePassword(
            @PathVariable("id") Long id,
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        log.info("Change password requested: userId={}", id);
        passwordService.changePassword(id, changePasswordRequest);
        log.info("Password changed: userId={}", id);
        return ResponseEntity.noContent().build();
    }
}
