package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.RoleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional(readOnly = true)
public interface PermissionQService {

    PermissionResponse findPermissionById(Long id);

    Page<PermissionResponse> findAllPermissions(Pageable pageable);

    Page<PermissionResponse> searchPermissions(String keyword, Pageable pageable);


    Set<RoleResponse> findRolesByPermission(Long permissionId);
}