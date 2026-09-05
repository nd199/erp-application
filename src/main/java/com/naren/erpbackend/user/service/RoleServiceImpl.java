package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    private final UserProfileRepository userProfileRepository;

    @Override
    public void addPermission(Long roleId, Long permissionId) {
        log.info("Add permission to role: roleId={}, permissionId={}", roleId, permissionId);

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

        try {
            roleRepository.save(role);
        } catch (DataIntegrityViolationException e) {
            log.warn("Add permission to role rejected by constraint violation: roleId={}, permissionId={}", roleId, permissionId);
            throw new ResourceNotFoundException("Failed to add permission: Role or Permission not found", e);
        }

        log.info("Permission added to role: roleId={}, permissionId={}, role={}", roleId, permissionId, role.getName());
    }

    @Override
    public void removePermission(Long roleId, Long permissionId) {
        log.info("Remove permission from role: roleId={}, permissionId={}", roleId, permissionId);

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
            log.warn("Remove permission failed, not assigned: roleId={}, permissionId={}", roleId, permissionId);
            throw new ResourceNotFoundException(
                    "Permission is not assigned to role: permissionId=" + permissionId
            );
        }

        try {
            roleRepository.save(role);
        } catch (DataIntegrityViolationException e) {
            log.warn("Remove permission from role rejected by constraint violation: roleId={}, permissionId={}", roleId, permissionId);
            throw new ResourceNotFoundException("Failed to remove permission: Role or Permission not found", e);
        }

        log.info("Permission removed from role: roleId={}, permissionId={}, role={}", roleId, permissionId, role.getName());
    }

    @Override
    public void assignRoleToUser(Long userId, Long roleId) {
        log.info("Assign role to user: userId={}, roleId={}", userId, roleId);

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

        if (userProfile.getRoles().add(role)) {
            try {
                userProfileRepository.save(userProfile);
            } catch (DataIntegrityViolationException e) {
                log.warn("Assign role to user rejected by constraint violation: userId={}, roleId={}", userId, roleId);
                throw new ResourceNotFoundException("Failed to assign role: User or Role not found", e);
            }

            log.info("Role assigned to user: userId={}, roleId={}, role={}", userId, roleId, role.getName());
        } else {
            log.info("Role already assigned to user: userId={}, roleId={}, role={}", userId, roleId, role.getName());
        }
    }

    @Override
    public void removeRoleFromUser(Long userId, Long roleId) {
        log.info("Remove role from user: userId={}, roleId={}", userId, roleId);

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
            log.warn("Remove role failed, not assigned: userId={}, roleId={}", userId, roleId);
            throw new ResourceNotFoundException(
                    "Role is not assigned to user: roleId=" + roleId
            );
        }

        try {
            userProfileRepository.save(userProfile);
        } catch (DataIntegrityViolationException e) {
            log.warn("Remove role from user rejected by constraint violation: userId={}, roleId={}", userId, roleId);
            throw new ResourceNotFoundException("Failed to remove role: User or Role not found", e);
        }

        log.info("Role removed from user: userId={}, roleId={}, role={}", userId, roleId, role.getName());
    }


    @Override
    public Set<PermissionResponse> findPermissionsByRole(Long roleId) {
        log.info("Fetch permissions for role: roleId={}", roleId);

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
        log.info("Role permissions fetched: roleId={}, role={}, count={}", roleId, role.getName(), responses.size());
        return responses;
    }
}