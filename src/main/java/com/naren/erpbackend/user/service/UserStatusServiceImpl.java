package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.InvalidUserStateException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class UserStatusServiceImpl implements UserStatusService {

    private final UserProfileRepository userProfileRepository;

    private final UserResponseMapper userResponseMapper;

    @Override
    public UserResponse activateUser(Long userId) {
        log.info("Activate user: id={}", userId);
        UserProfile user = findUserById(userId);
        UserStatus fromStatus = user.getStatus();

        validateTransition(fromStatus, UserStatus.ACTIVE);

        user.setStatus(UserStatus.ACTIVE);
        UserProfile savedUser = userProfileRepository.save(user);
        UserResponse response = userResponseMapper.apply(savedUser);
        log.info("User activated: id={}, username={}, from={}, to={}",
                response.id(), response.username(), fromStatus, response.status());
        return response;
    }

    @Override
    public UserResponse deactivateUser(Long userId) {
        log.info("Deactivate user: id={}", userId);
        UserProfile user = findUserById(userId);
        UserStatus fromStatus = user.getStatus();

        validateTransition(fromStatus, UserStatus.INACTIVE);

        user.setStatus(UserStatus.INACTIVE);
        UserProfile savedUser = userProfileRepository.save(user);
        UserResponse response = userResponseMapper.apply(savedUser);
        log.info("User deactivated: id={}, username={}, from={}, to={}",
                response.id(), response.username(), fromStatus, response.status());
        return response;
    }

    @Override
    public UserResponse lockUser(Long userId) {
        log.info("Lock user: id={}", userId);
        UserProfile user = findUserById(userId);
        UserStatus fromStatus = user.getStatus();
        validateTransition(fromStatus, UserStatus.LOCKED);

        user.setStatus(UserStatus.LOCKED);
        UserProfile savedUser = userProfileRepository.save(user);
        UserResponse response = userResponseMapper.apply(savedUser);
        log.info("User locked: id={}, username={}, from={}, to={}",
                response.id(), response.username(), fromStatus, response.status());
        return response;
    }

    @Override
    public UserResponse unlockUser(Long userId) {
        log.info("Unlock user: id={}", userId);
        UserProfile user = findUserById(userId);
        UserStatus fromStatus = user.getStatus();

        validateTransition(fromStatus, UserStatus.ACTIVE);

        user.setStatus(UserStatus.ACTIVE);

        UserProfile savedUser = userProfileRepository.save(user);
        UserResponse response = userResponseMapper.apply(savedUser);
        log.info("User unlocked: id={}, username={}, from={}, to={}",
                response.id(), response.username(), fromStatus, response.status());
        return response;
    }

    private UserProfile findUserById(Long userId) {
        return userProfileRepository.findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "User not found with id: " + userId)
                );
    }

    private void validateTransition(UserStatus currentStatus, UserStatus targetStatus) {
        boolean isValid = switch (currentStatus) {
            case ACTIVE -> targetStatus == UserStatus.INACTIVE
                    || targetStatus == UserStatus.LOCKED;
            case INACTIVE, LOCKED -> targetStatus == UserStatus.ACTIVE;
        };

        if (!isValid) {
            log.warn("Invalid user state transition rejected: from={}, to={}", currentStatus, targetStatus);
            throw new InvalidUserStateException(
                    "Cannot transition from " + currentStatus + " to " + targetStatus);
        }
    }
}