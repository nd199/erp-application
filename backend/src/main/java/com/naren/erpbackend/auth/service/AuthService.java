package com.naren.erpbackend.auth.service;

import com.naren.erpbackend.auth.dto.TokenResponse;
import com.naren.erpbackend.security.SecurityUser;
import com.naren.erpbackend.security.service.JwtService;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private static final String TOKEN_TYPE = "Bearer";

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserProfileRepository userRepository;

    public TokenResponse login(String username, String password) {
        log.info("Login attempt for user: {}", username);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        SecurityUser secureUser = (SecurityUser) authentication.getPrincipal();

        UserProfile user = userRepository
                .findByUsernameWithRolesAndPermissions(secureUser.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        log.info("Login successful: user={}, roles={}",
                user.getUsername(),
                user.getRoles().stream().map(r -> r.getName()).toList());

        return new TokenResponse(
                accessToken,
                refreshToken,
                TOKEN_TYPE,
                jwtService.getAccessExpirationMs()
        );
    }

    public TokenResponse refresh(String refreshToken) {
        String userName = jwtService.extractSubject(refreshToken);
        log.info("Token refresh attempt for user: {}", userName);

        UserProfile user = userRepository
                .findByUsernameWithRolesAndPermissions(userName)
                .orElseThrow(() -> new BadCredentialsException("Invalid token"));

        SecurityUser securityUser = new SecurityUser(user);

        if (!jwtService.isTokenValid(refreshToken, securityUser)) {
            log.warn("Invalid refresh token for user: {}", userName);
            throw new BadCredentialsException("Invalid refresh token");
        }

        String accessToken = jwtService.generateAccessToken(user);

        log.info("Token refreshed successfully: user={}", userName);

        return new TokenResponse(
                accessToken,
                refreshToken,
                TOKEN_TYPE,
                jwtService.getAccessExpirationMs()
        );
    }
}
