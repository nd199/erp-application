package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.RoleResponse;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional(readOnly = true)
public interface UserRoleService {

    @Transactional
    void assignRole(Long userId, Long roleId);

    @Transactional
    void removeRole(Long userId, Long roleId);

    Set<RoleResponse> getUserRoles(Long userId);

    RoleResponse getUserRole(Long userId, Long roleId);

    boolean hasRole(Long userId, Long roleId);
}
