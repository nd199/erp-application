package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.entity.Permission;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface PermissionService {

    @Transactional
    Permission createPermission(String name, String description);

    @Transactional
    Permission updatePermission(Long id, String name, String description);

    @Transactional
    void deletePermission(Long id);

    Permission findById(Long id);

    Permission findByName(String name);
}
