package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.entity.Permission;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface PermissionService {

    @Transactional
    Permission createPermission(String name, String description);

    Permission findByName(String name);
}