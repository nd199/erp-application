package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.InvalidPasswordException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.ChangePasswordRequest;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordServiceImpl implements PasswordService {


    private final UserProfileRepository userProfileRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        log.info("Change password: userId={}", userId);

        UserProfile userProfile = userProfileRepository
                .findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User not found")
                );

        if (!passwordEncoder.matches(
                request.oldPassword(),
                userProfile.getPassword()
        )) {
            log.warn("Change password rejected, old password mismatch: userId={}", userId);
            throw new InvalidPasswordException("Old password is incorrect");
        }

        if (passwordEncoder.matches(
                request.newPassword(),
                userProfile.getPassword()
        )) {
            log.warn("Change password rejected, new password equals old: userId={}", userId);
            throw new InvalidPasswordException(
                    "New password must be different from old password");
        }

        userProfile.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        try {
            userProfileRepository.save(userProfile);
        } catch (DataIntegrityViolationException e) {
            log.error("Password change failed due to constraint violation: userId={}", userId);
            throw new InvalidPasswordException("Failed to update password", e);
        }

        log.info("Password changed: userId={}, username={}", userId, userProfile.getUsername());
    }
}
