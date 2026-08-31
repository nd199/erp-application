package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQServiceImpl implements UserQService {

    private final UserProfileRepository repository;

    private final UserResponseMapper userResponseMapper;

    @Override
    public UserResponse fetchUserById(Long id) {
        log.info("Entering fetchUserById with id: {}", id);
        UserProfile user = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with id: " + id)
        );
        UserResponse response = userResponseMapper.apply(user);
        log.info("Exiting fetchUserById");
        return response;
    }

    @Override
    public UserResponse fetchUserByUsername(String username) {
        log.info("Entering fetchUserByUsername with username: {}", username);
        if (username == null) {
            throw new ValidationException("username is required");
        }

        UserProfile user = repository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with username: " + username)
        );
        UserResponse response = userResponseMapper.apply(user);
        log.info("Exiting fetchUserByUsername");
        return response;
    }

    @Override
    public UserResponse fetchUserByEmail(String email) {
        log.info("Entering fetchUserByEmail with email: {}", email);
        if (email == null) {
            throw new ValidationException("email is required");
        }

        UserProfile user = repository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with email: " + email)
        );
        UserResponse response = userResponseMapper.apply(user);
        log.info("Exiting fetchUserByEmail");
        return response;
    }

    @Override
    public Page<UserResponse> findAllUsers(Pageable pageable) {
        log.info("Entering findAllUsers with pageable: {}", pageable);
        Page<UserProfile> users = repository.findAllUsers(pageable);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }

        Page<UserResponse> responses = users.map(userResponseMapper);
        log.info("Exiting findAllUsers");
        return responses;
    }

    @Override
    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        log.info("Entering searchUsers with keyword: {} and pageable: {}", keyword, pageable);
        if (keyword == null || keyword.isBlank()) {
            throw new ValidationException("search keyword is required");
        }

        Page<UserProfile> users = repository.searchUsers(keyword.trim(), pageable);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found for keyword: " + keyword);
        }

        Page<UserResponse> responses = users.map(userResponseMapper);
        log.info("Exiting searchUsers");
        return responses;
    }

    @Transactional(readOnly = true)
    @Override
    public Set<RoleResponse> findRolesByUser(Long userId) {
        log.info("Entering findRolesByUser with userId: {}", userId);
        UserProfile userProfile = repository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with id: " + userId)
        );
        Set<RoleResponse> responses = userProfile.getRoles()
                .stream().map(role ->
                        new RoleResponse(
                                role.getId(),
                                role.getName(),
                                role.getDescription()
                        )
                ).collect(Collectors.toSet());
        log.info("Exiting findRolesByUser");
        return responses;
    }

}