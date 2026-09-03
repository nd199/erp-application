package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleQServiceImpl implements RoleQService {

    private final RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    private final RoleResponseMapper roleResponseMapper;

    private final UserResponseMapper userResponseMapper;

    @Override
    public RoleResponse findRoleById(Long roleId) {
        log.info("Fetch role by id: roleId={}", roleId);
        Role role = roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Role not found: " + roleId
                        )
                );

        RoleResponse response = roleResponseMapper.apply(role);
        log.info("Role fetched by id: roleId={}, name={}", response.id(), response.name());
        return response;
    }

    @Override
    public Page<RoleResponse> findAllRoles(Pageable pageable) {
        log.info("Fetch all roles: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<RoleResponse> responses = roleRepository.findAll(pageable)
                .map(roleResponseMapper);
        log.info("All roles fetched: elements={}, total={}", responses.getNumberOfElements(), responses.getTotalElements());
        return responses;
    }

    @Override
    public Page<RoleResponse> searchRoles(String keyword, Pageable pageable) {
        log.info("Search roles: keyword={}, page={}, size={}", keyword, pageable.getPageNumber(), pageable.getPageSize());
        Page<RoleResponse> responses = roleRepository.searchRoles(keyword, pageable)
                .map(roleResponseMapper);
        log.info("Role search completed: keyword={}, matches={}", keyword, responses.getNumberOfElements());
        return responses;
    }

    @Override
    public Set<UserResponse> findUsersByRole(Long roleId) {
        log.info("Fetch users for role: roleId={}", roleId);
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + roleId));
        Set<UserResponse> responses = role.getUsers()
                .stream()
                .map(userResponseMapper)
                .collect(Collectors.toSet());
        log.info("Role users fetched: roleId={}, role={}, count={}", roleId, role.getName(), responses.size());
        return responses;
    }

    @Override
    public boolean hasPermission(Long roleId, Long permissionId) {
        log.info("Check role permission: roleId={}, permissionId={}", roleId, permissionId);
        Role role = roleRepository
                .findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Role not found: " + roleId));
        Permission permission = permissionRepository
                .findById(permissionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permission not found: " + permissionId)
                );

        boolean hasPermission = role.getPermissions()
                .stream().anyMatch(p -> p.getId().equals(permission.getId()));
        log.info("Role permission check: roleId={}, permissionId={}, hasPermission={}", roleId, permissionId, hasPermission);
        return hasPermission;
    }
}