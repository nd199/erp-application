package com.naren.erpbackend.user.service;


import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional(readOnly = true)
public interface RoleQService {

    RoleResponse findRoleById(Long roleId);

    RoleResponse findRoleByName(String name);

    Page<RoleResponse> findAllRoles(Pageable pageable);

    Page<RoleResponse> searchRoles(String keyword, Pageable pageable);

    Set<UserResponse> findUsersByRole(Long roleId);

    boolean hasPermission(Long roleId, Long permissionId);
}