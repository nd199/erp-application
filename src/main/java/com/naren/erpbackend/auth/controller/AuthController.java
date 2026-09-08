package com.naren.erpbackend.auth.controller;

import com.naren.erpbackend.auth.dto.AuthRequest;
import com.naren.erpbackend.auth.dto.RefreshRequest;
import com.naren.erpbackend.auth.dto.TokenResponse;
import com.naren.erpbackend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody AuthRequest request) {
        log.info("POST /api/v1/auth/login username={}", request.username());
        return ResponseEntity.ok(authService.login(request.username(), request.password()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        log.info("POST /api/v1/auth/refresh");
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }
}
