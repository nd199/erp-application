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
            throw new ResourceExistsException("Permission already exists: " + name);
        }

        Permission permission = Permission.builder()
                .name(name)
                .description(description)
                .build();

        try {
            Permission saved = permissionRepository.save(permission);
            log.info("Permission created: id={}, name={}", saved.getId(), saved.getName());
            return saved;
        } catch (DataIntegrityViolationException e) {
            log.warn("Create permission rejected by unique constraint: name={}", name);
            throw new ResourceExistsException("Permission already exists: " + name, e);
        }
    }

    @Override
    public Permission updatePermission(Long id, String name, String description) {
        log.info("Update permission: id={}", id);

        Permission permission = findPermissionById(id);

        permission.setName(name);
        permission.setDescription(description);

        try {
            Permission updated = permissionRepository.save(permission);
            log.info("Permission updated: id={}, name={}", updated.getId(), updated.getName());
            return updated;
        } catch (DataIntegrityViolationException e) {
            log.warn("Update permission rejected by unique constraint: id={}, name={}", id, name);
            throw new ResourceExistsException("Permission already exists: " + name, e);
        }
    }

    @Override
    public void deletePermission(Long id) {
        log.info("Delete permission: id={}", id);

        Permission permission = findPermissionById(id);

        try {
            permissionRepository.delete(permission);
        } catch (DataIntegrityViolationException e) {
            log.warn("Delete permission rejected by constraint violation: id={}", id);
            throw new ResourceExistsException("Permission cannot be deleted due to existing references", e);
        }

        log.info("Permission deleted: id={}, name={}", id, permission.getName());
    }

    @Override
    public Permission findById(Long id) {
        return findPermissionById(id);
    }

    @Override
    public Permission findByName(String name) {
        log.info("Fetch permission by name: name={}", name);
        Permission permission = permissionRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found: " + name));
        log.info("Permission fetched by name: id={}, name={}", permission.getId(), permission.getName());
        return permission;
    }

    private Permission findPermissionById(Long id) {
        log.info("Fetch permission by id: id={}", id);
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found: " + id));
        log.info("Permission fetched: id={}, name={}", permission.getId(), permission.getName());
        return permission;
    }
}
