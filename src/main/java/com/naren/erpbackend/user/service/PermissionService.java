package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.entity.Permission;

public interface PermissionService {

    Permission createPermission(String name, String description);

    Permission findByName(String name);

}