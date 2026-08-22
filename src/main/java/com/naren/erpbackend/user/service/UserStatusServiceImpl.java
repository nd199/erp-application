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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class UserStatusServiceImpl implements UserStatusService {

    private final UserProfileRepository userProfileRepository;

    private final UserResponseMapper userResponseMapper;

    @Override
    @Transactional
    public UserResponse activateUser(Long userId) {

        UserProfile user = findUserById(userId);

        validateTransition(user.getStatus(), UserStatus.ACTIVE);

        user.setStatus(UserStatus.ACTIVE);
        UserProfile savedUser = userProfileRepository.save(user);
        log.info("User activated: id={}, username={}", userId, savedUser.getUsername());
        return userResponseMapper.apply(savedUser);
    }

    @Override
    @Transactional
    public UserResponse deactivateUser(Long userId) {

        UserProfile user = findUserById(userId);

        validateTransition(user.getStatus(), UserStatus.INACTIVE);

        user.setStatus(UserStatus.INACTIVE);
        UserProfile savedUser = userProfileRepository.save(user);
        log.info("User deactivated: id={}, username={}", userId, savedUser.getUsername());
        return userResponseMapper.apply(savedUser);
    }

    @Override
    @Transactional
    public UserResponse lockUser(Long userId) {
        UserProfile user = findUserById(userId);
        validateTransition(user.getStatus(), UserStatus.LOCKED);

        user.setStatus(UserStatus.LOCKED);
        UserProfile savedUser = userProfileRepository.save(user);
        log.info("User locked: id={}, username={}", userId, savedUser.getUsername());
        return userResponseMapper.apply(savedUser);
    }

    @Override
    @Transactional
    public UserResponse unlockUser(Long userId) {

        UserProfile user = findUserById(userId);
        validateTransition(user.getStatus(), UserStatus.ACTIVE);

        user.setStatus(UserStatus.ACTIVE);

        UserProfile savedUser = userProfileRepository.save(user);
        log.info("User unlocked: id={}, username={}", userId, savedUser.getUsername());
        return userResponseMapper.apply(savedUser);
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
            throw new InvalidUserStateException(
                    "Cannot transition from " + currentStatus + " to " + targetStatus);
        }
    }
}