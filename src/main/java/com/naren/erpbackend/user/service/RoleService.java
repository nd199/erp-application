package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.RoleResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional(readOnly = true)
public interface RoleService {

    @Transactional
    void addPermission(Long roleId, Long permissionId);

    @Transactional
    void removePermission(Long roleId, Long permissionId);

    @Transactional
    void assignRoleToUser(Long userId, Long roleId);

    @Transactional
    void removeRoleFromUser(Long userId, Long roleId);

    Set<PermissionResponse> findPermissionsByRole(Long roleId);
}