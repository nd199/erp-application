package com.naren.erpbackend.security.service;

import com.naren.erpbackend.security.jwt.JwtProperties;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JwtService {

    private final JwtProperties jwtProperties;
    private final SecretKey signingKey;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.signingKey = Keys.hmacShaKeyFor(
                jwtProperties.secret().getBytes(StandardCharsets.UTF_8)
        );
        log.info("JwtService initialized: issuer={}, accessExpiry={}ms, refreshExpiry={}ms",
                jwtProperties.issuer(),
                jwtProperties.accessExpirationMs(),
                jwtProperties.refreshExpirationMs());
    }

    public String generateAccessToken(UserProfile user) {
        String token = generateToken(user, jwtProperties.accessExpirationMs());
        log.debug("Generated access token for user: {}", user.getUsername());
        return token;
    }

    public String generateRefreshToken(UserProfile user) {
        String token = generateToken(user, jwtProperties.refreshExpirationMs());
        log.debug("Generated refresh token for user: {}", user.getUsername());
        return token;
    }

    private String generateToken(UserProfile user, long expirationMs) {
        Instant now = Instant.now();
        Date expiration = Date.from(now.plusMillis(expirationMs));

        return Jwts
                .builder()
                .subject(user.getUsername())
                .claim("userId", user.getId())
                .claim("roles", user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .claim("permissions", user.getRoles().stream()
                        .flatMap(role -> role.getPermissions().stream()
                                .map(Permission::getName))
                        .collect(Collectors.toSet()))
                .issuer(jwtProperties.issuer())
                .issuedAt(Date.from(now))
                .expiration(expiration)
                .signWith(signingKey)
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts
                .parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractSubject(String token) {
        return validateToken(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractSubject(token);
            boolean valid = username.equals(userDetails.getUsername());
            if (!valid) {
                log.warn("Token user mismatch: token={}, expected={}", username, userDetails.getUsername());
            }
            return valid;
        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public long getAccessExpirationMs() {
        return jwtProperties.accessExpirationMs();
    }
}
