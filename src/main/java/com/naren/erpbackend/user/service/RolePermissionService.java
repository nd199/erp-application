package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.PermissionResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional(readOnly = true)
public interface RolePermissionService {

    @Transactional
    void assignPermission(Long roleId, Long permissionId);

    @Transactional
    void removePermission(Long roleId, Long permissionId);

    Set<PermissionResponse> getRolePermissions(Long roleId);

    boolean hasPermission(Long roleId, Long permissionId);

}