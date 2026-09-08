package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.PermissionResponseMapper;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
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
@RequiredArgsConstructor
@Slf4j
public class PermissionQServiceImpl implements PermissionQService {

    private final PermissionRepository permissionRepository;
    private final PermissionResponseMapper permissionMapper;
    private final RoleRepository roleRepository;
    private final RoleResponseMapper roleResponseMapper;

    @Override
    public PermissionResponse findPermissionById(Long id) {
        log.info("Fetch permission by id: id={}", id);
        PermissionResponse response = permissionMapper.apply(
                permissionRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Permission not found with id: " + id)
                        ));
        log.info("Permission fetched by id: id={}, name={}", response.id(), response.name());
        return response;
    }

    @Override
    public Page<PermissionResponse> findAllPermissions(Pageable pageable) {
        log.info("Fetch all permissions: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<PermissionResponse> responses = permissionRepository
                .findAll(pageable)
                .map(permissionMapper);
        log.info("All permissions fetched: elements={}, total={}", responses.getNumberOfElements(), responses.getTotalElements());
        return responses;
    }

    @Override
    public Page<PermissionResponse> searchPermissions(String keyword, Pageable pageable) {
        log.info("Search permissions: keyword={}, page={}, size={}", keyword, pageable.getPageNumber(), pageable.getPageSize());
        Page<PermissionResponse> responses = permissionRepository
                .searchPermissions(keyword, pageable)
                .map(permissionMapper);
        log.info("Permission search completed: keyword={}, matches={}", keyword, responses.getNumberOfElements());
        return responses;
    }

    @Override
    public Set<RoleResponse> findRolesByPermission(Long permissionId) {
        log.info("Fetch roles for permission: permissionId={}", permissionId);

        if (!permissionRepository.existsById(permissionId)) {
            log.warn("Fetch roles failed, permission not found: permissionId={}", permissionId);
            throw new ResourceNotFoundException("Permission not found: " + permissionId);
        }

        Set<RoleResponse> responses = roleRepository
                .findRolesByPermissionId(permissionId)
                .stream()
                .map(roleResponseMapper)
                .collect(Collectors.toSet());
        log.info("Permission roles fetched: permissionId={}, count={}", permissionId, responses.size());
        return responses;
    }
}