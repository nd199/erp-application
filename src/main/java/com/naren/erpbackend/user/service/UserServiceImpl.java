package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.UserExistsException;
import com.naren.erpbackend.user.dto.RegRequest;
import com.naren.erpbackend.user.dto.RegResponse;
import com.naren.erpbackend.user.dto.RegResponseMapper;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.Locale;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserProfileRepository userProfileRepository;

    private final PasswordEncoder passwordEncoder;

    private final RegResponseMapper mapper;

    @Override
    @Transactional
    public RegResponse registerUser(RegRequest regRequest) {
        String username = normalizeUsername(regRequest.username());
        String email = normalizeEmail(regRequest.email());

        if (isUserPresent(username, email)) {
            log.warn("Registration rejected, identity already in use: username={}, email={}", username, email);
            throw new UserExistsException("Username or email already exists");
        }

        UserProfile userProfile = UserProfile
                .builder()
                .username(username)
                .email(email)
                .password(
                        passwordEncoder
                                .encode(
                                        regRequest
                                                .password()
                                )
                )
                .build();

        try {
            UserProfile savedUserProfile = userProfileRepository.save(userProfile);
            log.info("User registered successfully: id={}, username={}", savedUserProfile.getId(), username);
            return mapper.apply(savedUserProfile);
        } catch (DataIntegrityViolationException e) {
            // A concurrent request slipped past the pre-check and hit a unique constraint.
            log.warn("Registration rejected by unique constraint: username={}, email={}", username, email);
            throw new UserExistsException("Username or email already exists", e);
        }
    }

    private boolean isUserPresent(String username, String email) {
        return userProfileRepository.existsByUsername(username)
                || userProfileRepository.existsByEmail(email);
    }

    private String normalizeUsername(String username) {
        return username.trim();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
