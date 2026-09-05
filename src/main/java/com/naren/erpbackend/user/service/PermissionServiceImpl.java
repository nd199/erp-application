package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public Permission createPermission(String name, String description) {
        log.info("Create permission: name={}", name);

        if (permissionRepository.existsByName(name)) {
            log.warn("Create permission rejected, already exists: name={}", name);
            throw new ResourceExistsException(
                    "Permission already exists: " + name
            );
        }

        Permission permission = Permission.builder()
                .name(name)
                .description(description)
                .build();

        try {
            Permission savedPermission = permissionRepository.save(permission);
            log.info("Permission created: id={}, name={}", savedPermission.getId(), savedPermission.getName());
            return savedPermission;
        } catch (DataIntegrityViolationException e) {
            log.warn("Create permission rejected by unique constraint: name={}", name);
            throw new ResourceExistsException("Permission already exists: " + name, e);
        }
    }

    @Override
    public Permission findByName(String name) {
        log.info("Fetch permission by name: name={}", name);
        Permission permission = permissionRepository.findByName(name)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permission not found: " + name
                        )
                );
        log.info("Permission fetched by name: id={}, name={}", permission.getId(), permission.getName());
        return permission;
    }

}