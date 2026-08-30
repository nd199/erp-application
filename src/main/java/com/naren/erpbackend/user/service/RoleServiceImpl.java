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
        log.info("createRole: name={}, description={}", name, description);

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

        return roleResponseMapper.apply(savedRole);
    }

    @Override
    public RoleResponse findByName(String name) {
        log.info("findByName: name={}", name);

        return roleResponseMapper.apply(roleRepository.findByName(name)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + name
                        )
                ));
    }

    @Override
    @Transactional
    public void addPermission(Long roleId, Long permissionId) {
        log.info("addPermission: roleId={}, permissionId={}", roleId, permissionId);

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
    }

    @Transactional
    @Override
    public void removePermission(Long roleId, Long permissionId) {
        log.info("removePermission: roleId={}, permissionId={}", roleId, permissionId);

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
    }

    @Transactional
    @Override
    public void assignRoleToUser(Long userId, Long roleId) {
        log.info("assignRoleToUser: userId={}, roleId={}", userId, roleId);

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
    }

    @Transactional
    @Override
    public void removeRoleFromUser(Long userId, Long roleId) {
        log.info("removeRoleFromUser: userId={}, roleId={}", userId, roleId);

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
    }


    @Transactional
    @Override
    public Set<PermissionResponse> findPermissionsByRole(Long roleId) {
        log.info("findPermissionsByRole: roleId={}", roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );


        return role.getPermissions().stream()
                .map(
                        permission -> new PermissionResponse(
                                permission.getId(),
                                permission.getName(),
                                permission.getDescription()
                        )
                ).collect(Collectors.toSet());
    }

    @Transactional
    @Override
    public boolean hasPermission(Long roleId, Long permissionId) {
        log.info("hasPermission: roleId={}, permissionId={}", roleId, permissionId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );

        return role.getPermissions()
                .stream()
                .anyMatch(permission ->
                        Objects.equals(permission.getId(), permissionId)
                );
    }

}