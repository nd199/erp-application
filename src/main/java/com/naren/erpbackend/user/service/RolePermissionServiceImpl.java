package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.PermissionResponseMapper;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class RolePermissionServiceImpl implements RolePermissionService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final PermissionResponseMapper permissionResponseMapper;

    @Override
    public void assignPermission(Long roleId, Long permissionId) {
        log.info("Assign permission: roleId={}, permissionId={}", roleId, permissionId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        role.getPermissions().add(permission);

        try {
            roleRepository.save(role);
        } catch (DataIntegrityViolationException e) {
            log.warn("Assign permission rejected by constraint violation: roleId={}, permissionId={}", roleId, permissionId);
            throw new ResourceNotFoundException("Failed to assign permission: Role or Permission not found", e);
        }
    }

    @Override
    public void removePermission(Long roleId, Long permissionId) {
        log.info("Remove permission: roleId={}, permissionId={}", roleId, permissionId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        role.getPermissions().remove(permission);

        try {
            roleRepository.save(role);
        } catch (DataIntegrityViolationException e) {
            log.warn("Remove permission rejected by constraint violation: roleId={}, permissionId={}", roleId, permissionId);
            throw new ResourceNotFoundException("Failed to remove permission: Role or Permission not found", e);
        }
    }

    @Override
    public Set<PermissionResponse> getRolePermissions(Long roleId) {
        log.info("Get role permissions: roleId={}", roleId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        return role.getPermissions().stream()
                .map(permissionResponseMapper)
                .collect(java.util.stream.Collectors.toSet());
    }

    @Override
    public boolean hasPermission(Long roleId, Long permissionId) {
        log.info("Check permission: roleId={}, permissionId={}", roleId, permissionId);

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));

        return role.getPermissions().stream()
                .anyMatch(p -> p.getId().equals(permission.getId()));
    }
}
