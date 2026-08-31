package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.PermissionResponseMapper;
import com.naren.erpbackend.user.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class PermissionQServiceImpl implements PermissionQService {

    private final PermissionRepository permissionRepository;
    private final PermissionResponseMapper permissionMapper;

    @Override
    public PermissionResponse findPermissionById(Long id) {
        log.info("Entering findPermissionById with id: {}", id);
        PermissionResponse response = permissionMapper.apply(
                permissionRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Permission not found with id: " + id)
                        ));
        log.info("Exiting findPermissionById");
        return response;
    }

    @Override
    public Page<PermissionResponse> findAllPermissions(Pageable pageable) {
        log.info("Entering findAllPermissions with pageable: {}", pageable);
        Page<PermissionResponse> responses = permissionRepository
                .findAll(pageable)
                .map(permissionMapper);
        log.info("Exiting findAllPermissions");
        return responses;
    }

    @Override
    public Page<PermissionResponse> searchPermissions(String keyword, Pageable pageable) {
        log.info("Entering searchPermissions with keyword: {} and pageable: {}", keyword, pageable);
        Page<PermissionResponse> responses = permissionRepository
                .searchPermissions(keyword, pageable)
                .map(permissionMapper);
        log.info("Exiting searchPermissions");
        return responses;
    }
}