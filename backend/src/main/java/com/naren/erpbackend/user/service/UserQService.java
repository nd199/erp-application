package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional(readOnly = true)
public interface UserQService {

    UserResponse fetchUserById(Long id);

    UserResponse fetchUserByUsername(String username);

    UserResponse fetchUserByEmail(String email);

    Page<UserResponse> findAllUsers(Pageable pageable);

    Page<UserResponse> searchUsers(String keyword, Pageable pageable);

    Set<RoleResponse> findRolesByUser(Long userId);

    boolean hasRole(Long userId, Long roleId);

    boolean hasPermission(Long userId, Long permissionId);
}