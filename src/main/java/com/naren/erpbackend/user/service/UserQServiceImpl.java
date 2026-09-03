package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserQServiceImpl implements UserQService {

    private final UserProfileRepository repository;

    private final UserResponseMapper userResponseMapper;

    private final RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    @Override
    public UserResponse fetchUserById(Long id) {
        log.info("Fetch user by id: id={}", id);
        UserProfile user = repository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with id: " + id)
        );
        UserResponse response = userResponseMapper.apply(user);
        log.info("User fetched by id: id={}, username={}, status={}", response.id(), response.username(), response.status());
        return response;
    }

    @Override
    public UserResponse fetchUserByUsername(String username) {
        log.info("Fetch user by username: username={}", username);
        if (username == null) {
            throw new ValidationException("username is required");
        }

        UserProfile user = repository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with username: " + username)
        );
        UserResponse response = userResponseMapper.apply(user);
        log.info("User fetched by username: id={}, username={}, status={}", response.id(), response.username(), response.status());
        return response;
    }

    @Override
    public UserResponse fetchUserByEmail(String email) {
        log.info("Fetch user by email: email={}", email);
        if (email == null) {
            throw new ValidationException("email is required");
        }

        UserProfile user = repository.findByEmail(email).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with email: " + email)
        );
        UserResponse response = userResponseMapper.apply(user);
        log.info("User fetched by email: id={}, email={}, status={}", response.id(), response.email(), response.status());
        return response;
    }

    @Override
    public Page<UserResponse> findAllUsers(Pageable pageable) {
        log.info("Fetch all users: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<UserProfile> users = repository.findAllUsers(pageable);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }

        Page<UserResponse> responses = users.map(userResponseMapper);
        log.info("All users fetched: elements={}, total={}", responses.getNumberOfElements(), responses.getTotalElements());
        return responses;
    }

    @Override
    public Page<UserResponse> searchUsers(String keyword, Pageable pageable) {
        log.info("Search users: keyword={}, page={}, size={}", keyword, pageable.getPageNumber(), pageable.getPageSize());
        if (keyword == null || keyword.isBlank()) {
            throw new ValidationException("search keyword is required");
        }

        Page<UserProfile> users = repository.searchUsers(keyword.trim(), pageable);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found for keyword: " + keyword);
        }

        Page<UserResponse> responses = users.map(userResponseMapper);
        log.info("User search completed: keyword={}, matches={}", keyword, responses.getNumberOfElements());
        return responses;
    }

    @Override
    public Set<RoleResponse> findRolesByUser(Long userId) {
        log.info("Fetch roles for user: userId={}", userId);
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
        log.info("User roles fetched: userId={}, count={}", userId, responses.size());
        return responses;
    }

    @Override
    public boolean hasRole(Long userId, Long roleId) {
        log.info("Check user role: userId={}, roleId={}", userId, roleId);

        UserProfile userProfile = repository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with id: " + userId)
        );

        Role role = roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Role not found with roleId :" + roleId
                        )
                );

        boolean hasRole = userProfile.getRoles()
                .stream()
                .anyMatch(r -> r.getId().equals(role.getId()));
        log.info("User role check: userId={}, roleId={}, hasRole={}", userId, roleId, hasRole);
        return hasRole;
    }


    @Override
    public boolean hasPermission(Long userId, Long permissionId) {
        log.info("Check user permission: userId={}, permissionId={}", userId, permissionId);

        UserProfile userProfile = repository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User Not found with id: " + userId)
        );

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Permission not found with permissionId :" + permissionId
                        )
                );

        boolean hasPermission = userProfile.getRoles()
                .stream()
                .anyMatch(r -> r.getPermissions().contains(permission));
        log.info("User permission check: userId={}, permissionId={}, hasPermission={}", userId, permissionId, hasPermission);
        return hasPermission;
    }
}