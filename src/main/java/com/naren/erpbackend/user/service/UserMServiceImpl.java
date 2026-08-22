package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.InvalidPasswordException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.exception.UserExistsException;
import com.naren.erpbackend.user.dto.*;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.Objects;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class UserMServiceImpl extends UserUtility implements UserMService {

    private final UserProfileRepository userProfileRepository;

    private final PasswordEncoder passwordEncoder;

    private final RegResponseMapper mapper;

    private final UserResponseMapper userResponseMapper;

    @Override
    @Transactional
    public RegResponse registerUser(RegRequest regRequest) {
        String username = normalizeUsername(regRequest.username());
        String email = normalizeEmail(regRequest.email());
        String phone = normalizePhone(regRequest.phone());
        String address = normalizeAddress(regRequest.address());

        if (isUserPresent(username, email)) {
            log.warn("Registration rejected, identity already in use: " +
                    "username={}, email={}", username, email);
            throw new UserExistsException("Username or email already exists");
        }

        UserProfile userProfile = UserProfile
                .builder()
                .username(username)
                .email(email)
                .phone(phone)
                .address(address)
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
            log.info("User registered successfully: id={}, username={}",
                    savedUserProfile.getId(), username);
            return mapper.apply(savedUserProfile);
        } catch (DataIntegrityViolationException e) {
            log.warn("Registration rejected by unique constraint: username={}, " +
                    "email={}", username, email);
            throw new UserExistsException("Username or email already exists", e);
        }
    }

    private boolean isUserPresent(String username, String email) {
        return userProfileRepository.existsByUsername(username)
                || userProfileRepository.existsByEmail(email);
    }

    @Transactional
    @Override
    public UserResponse updateUser(Long userId, UserUpdateRequest userUpdateRequest) {

        UserProfile user = userProfileRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found")
        );

        String username = Objects.nonNull(userUpdateRequest.username()) ?
                normalizeUsername(userUpdateRequest.username()) : null;
        String email = Objects.nonNull(userUpdateRequest.email()) ?
                normalizeEmail(userUpdateRequest.email()) : null;
        String phone = Objects.nonNull(userUpdateRequest.phone()) ?
                normalizePhone(userUpdateRequest.phone()) : null;
        String address = Objects.nonNull(userUpdateRequest.address()) ?
                normalizeAddress(userUpdateRequest.address()) : null;

        boolean isUpdateRequired = false;

        if (!Objects.equals(user.getUsername(), username)) {
            user.setUsername(username);
            isUpdateRequired = true;
        }

        if (!Objects.equals(user.getEmail(), email)) {
            user.setEmail(email);
            isUpdateRequired = true;
        }

        if (!Objects.equals(user.getPhone(), phone)) {
            user.setPhone(phone);
            isUpdateRequired = true;
        }

        if (!Objects.equals(user.getAddress(), address)) {
            user.setAddress(address);
            isUpdateRequired = true;
        }

        if (isUpdateRequired) {
            try {
                userProfileRepository.save(user);
            } catch (DataIntegrityViolationException e) {
                log.warn("Update rejected by unique constraint: username={}, " +
                        "email={}", user.getUsername(), user.getEmail());
                throw new UserExistsException("Username or email already exists", e);
            }
        }

        return userResponseMapper.apply(user);
    }

    @Transactional
    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {

        UserProfile userProfile = userProfileRepository
                .findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User not found")
                );

        if (!passwordEncoder.matches(
                request.oldPassword(),
                userProfile.getPassword()
        )) {
            throw new InvalidPasswordException("Old password is incorrect");
        }

        if (passwordEncoder.matches(
                request.newPassword(),
                userProfile.getPassword()
        )) {
            throw new InvalidPasswordException(
                    "New password must be different from old password");
        }

        userProfile.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        userProfileRepository.save(userProfile);
    }


}
