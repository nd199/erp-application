package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    private final UserProfileRepository userProfileRepository;

    private final RoleResponseMapper roleResponseMapper;

    @Override
    public RoleResponse createRole(String name, String description) {
        log.info("Entering createRole with name: {} and description: {}", name, description);

        if (roleRepository.existsByName(name)) {
            throw new ResourceExistsException(
                    "Role already exists: " + name
            );
        }

        Role role = Role.builder()
                .name(name)
                .description(description)
                .build();

        Role savedRole = roleRepository.save(role);
        log.info("Exiting createRole");
        return roleResponseMapper.apply(savedRole);
    }

    @Override
    public RoleResponse findByName(String name) {
        log.info("Entering findByName with name: {}", name);

        RoleResponse response = roleResponseMapper.apply(roleRepository.findByName(name)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + name
                        )
                ));
        log.info("Exiting findByName");
        return response;
    }

    @Override
    @Transactional
    public void addPermission(Long roleId, Long permissionId) {
        log.info("Entering addPermission with roleId: {} and permissionId: {}", roleId, permissionId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permission not found: " + permissionId
                        )
                );
        role.getPermissions().add(permission);

        roleRepository.save(role);
        log.info("Exiting addPermission");
    }

    @Transactional
    @Override
    public void removePermission(Long roleId, Long permissionId) {
        log.info("Entering removePermission with roleId: {} and permissionId: {}", roleId, permissionId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permission not found: " + permissionId
                        )
                );
        boolean removed = role.getPermissions().remove(permission);

        if (!removed) {
            throw new ResourceNotFoundException(
                    "Permission is not assigned to role: permissionId=" + permissionId
            );
        }

        roleRepository.save(role);
        log.info("Exiting removePermission");
    }

    @Transactional
    @Override
    public void assignRoleToUser(Long userId, Long roleId) {
        log.info("Entering assignRoleToUser with userId: {} and roleId: {}", userId, roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: " + userId
                        )
                );
        userProfile.getRoles().add(role);

        userProfileRepository.save(userProfile);
        log.info("Exiting assignRoleToUser");
    }

    @Transactional
    @Override
    public void removeRoleFromUser(Long userId, Long roleId) {
        log.info("Entering removeRoleFromUser with userId: {} and roleId: {}", userId, roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found: " + userId
                        )
                );
        boolean removed = userProfile.getRoles().remove(role);

        if (!removed) {
            throw new ResourceNotFoundException(
                    "Role is not assigned to user: roleId=" + roleId
            );
        }

        userProfileRepository.save(userProfile);
        log.info("Exiting removeRoleFromUser");
    }


    @Transactional
    @Override
    public Set<PermissionResponse> findPermissionsByRole(Long roleId) {
        log.info("Entering findPermissionsByRole with roleId: {}", roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );


        Set<PermissionResponse> responses = role.getPermissions().stream()
                .map(
                        permission -> new PermissionResponse(
                                permission.getId(),
                                permission.getName(),
                                permission.getDescription()
                        )
                ).collect(Collectors.toSet());
        log.info("Exiting findPermissionsByRole");
        return responses;
    }

    @Transactional
    @Override
    public boolean hasPermission(Long roleId, Long permissionId) {
        log.info("Entering hasPermission with roleId: {} and permissionId: {}", roleId, permissionId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );

        boolean hasPermission = role.getPermissions()
                .stream()
                .anyMatch(permission ->
                        Objects.equals(permission.getId(), permissionId)
                );
        log.info("Exiting hasPermission");
        return hasPermission;
    }

}