package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.RoleResponse;
import jakarta.transaction.Transactional;

import java.util.Set;

public interface RoleService {

    RoleResponse createRole(String name, String description);

    RoleResponse findByName(String name);

    void addPermission(Long roleId, Long permissionId);

    @Transactional
    void removePermission(Long roleId, Long permissionId);

    @Transactional
    void assignRoleToUser(Long userId, Long roleId);

    @Transactional
    void removeRoleFromUser(Long userId, Long roleId);

    @Transactional
    Set<PermissionResponse> findPermissionsByRole(Long roleId);

    @Transactional
    boolean hasPermission(Long roleId, Long permissionId);
}