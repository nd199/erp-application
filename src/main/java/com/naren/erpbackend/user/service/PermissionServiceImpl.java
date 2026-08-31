package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public Permission createPermission(String name, String description) {
        log.info("Entering createPermission with name: {} and description: {}", name, description);

        if (permissionRepository.existsByName(name)) {
            throw new ResourceExistsException(
                    "Permission already exists: " + name
            );
        }

        Permission permission = Permission.builder()
                .name(name)
                .description(description)
                .build();
        Permission savedPermission = permissionRepository.save(permission);
        log.info("Exiting createPermission");
        return savedPermission;
    }

    @Override
    public Permission findByName(String name) {
        log.info("Entering findByName with name: {}", name);
        Permission permission = permissionRepository.findByName(name)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permission not found: " + name
                        )
                );
        log.info("Exiting findByName");
        return permission;
    }

}