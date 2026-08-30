package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public Permission createPermission(String name, String description) {

        if (permissionRepository.existsByName(name)) {
            throw new ResourceExistsException(
                    "Permission already exists: " + name
            );
        }

        Permission permission = Permission.builder()
                .name(name)
                .description(description)
                .build();
        return permissionRepository.save(permission);
    }

    @Override
    public Permission findByName(String name) {
        return permissionRepository.findByName(name)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Permission not found: " + name
                        )
                );
    }

}