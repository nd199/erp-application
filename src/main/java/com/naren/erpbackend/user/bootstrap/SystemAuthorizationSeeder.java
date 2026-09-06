package com.naren.erpbackend.user.bootstrap;

import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Slf4j
@Component
@Order(0)
@RequiredArgsConstructor
public class SystemAuthorizationSeeder implements CommandLineRunner {

    private static final String SUPER_ADMIN = "SUPER_ADMIN";
    private static final String ADMIN = "ADMIN";
    private static final String MANAGER = "MANAGER";
    private static final String EMPLOYEE = "EMPLOYEE";

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Seeding system authorization data (roles, permissions, role-permission mappings)");

        Map<String, String> permissions = systemPermissions();
        Map<String, String> roles = systemRoles();
        Map<String, Set<String>> rolePermissions = systemRolePermissions();

        for (Map.Entry<String, String> entry : permissions.entrySet()) {
            ensurePermission(entry.getKey(), entry.getValue());
        }

        for (Map.Entry<String, String> entry : roles.entrySet()) {
            ensureRole(entry.getKey(), entry.getValue());
        }

        for (Map.Entry<String, Set<String>> entry : rolePermissions.entrySet()) {
            assignPermissionsToRole(entry.getKey(), entry.getValue());
        }

        log.info("System authorization data seeding complete");
    }

    private void ensurePermission(String name, String description) {
        if (permissionRepository.existsByName(name)) {
            return;
        }
        permissionRepository.save(Permission.builder()
                .name(name)
                .description(description)
                .build());
        log.info("Created permission: {}", name);
    }

    private void ensureRole(String name, String description) {
        if (roleRepository.existsByName(name)) {
            return;
        }
        roleRepository.save(Role.builder()
                .name(name)
                .description(description)
                .build());
        log.info("Created role: {}", name);
    }

    private void assignPermissionsToRole(String roleName, Set<String> permissionNames) {
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Role missing after seed: " + roleName));

        for (String permissionName : permissionNames) {
            Permission permission = permissionRepository.findByName(permissionName)
                    .orElseThrow(() -> new IllegalStateException(
                            "Permission missing after seed: " + permissionName));
            role.getPermissions().add(permission);
        }
        roleRepository.save(role);
        log.info("Bound {} permission(s) to role: {}", permissionNames.size(), roleName);
    }

    private Map<String, String> systemPermissions() {
        Map<String, String> permissions = new LinkedHashMap<>();

        permissions.put("USER_CREATE", "Create a new user");
        permissions.put("USER_READ", "Read user details");
        permissions.put("USER_UPDATE", "Update user details");
        permissions.put("USER_DELETE", "Delete a user");
        permissions.put("USER_ACTIVATE", "Activate a user");
        permissions.put("USER_DEACTIVATE", "Deactivate a user");
        permissions.put("USER_LOCK", "Lock a user account");
        permissions.put("USER_UNLOCK", "Unlock a user account");
        permissions.put("USER_CHANGE_PASSWORD", "Change user password");

        permissions.put("ROLE_READ", "Read role details");
        permissions.put("ROLE_ASSIGN", "Assign role to user");
        permissions.put("ROLE_REMOVE", "Remove role from user");

        permissions.put("PERMISSION_READ", "Read permission details");
        permissions.put("PERMISSION_ASSIGN", "Assign permission to role");
        permissions.put("PERMISSION_REMOVE", "Remove permission from role");

        permissions.put("EMPLOYEE_CREATE", "Create an employee record");
        permissions.put("EMPLOYEE_READ", "Read employee records");
        permissions.put("EMPLOYEE_UPDATE", "Update employee records");
        permissions.put("EMPLOYEE_DELETE", "Delete an employee record");

        return permissions;
    }

    private Map<String, String> systemRoles() {
        Map<String, String> roles = new LinkedHashMap<>();
        roles.put(SUPER_ADMIN, "Full system access, all permissions");
        roles.put(ADMIN, "Administrative access, manages users and roles");
        roles.put(MANAGER, "Manages employees and team data");
        roles.put(EMPLOYEE, "Standard employee access");
        return roles;
    }

    private Map<String, Set<String>> systemRolePermissions() {
        Set<String> allPermissions = Set.of(
                "USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE",
                "USER_ACTIVATE", "USER_DEACTIVATE", "USER_LOCK", "USER_UNLOCK",
                "USER_CHANGE_PASSWORD",
                "ROLE_READ", "ROLE_ASSIGN", "ROLE_REMOVE",
                "PERMISSION_READ", "PERMISSION_ASSIGN", "PERMISSION_REMOVE",
                "EMPLOYEE_CREATE", "EMPLOYEE_READ", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE"
        );

        Set<String> managerPermissions = Set.of(
                "USER_READ",
                "ROLE_READ",
                "PERMISSION_READ",
                "EMPLOYEE_CREATE", "EMPLOYEE_READ", "EMPLOYEE_UPDATE"
        );

        Set<String> employeePermissions = Set.of(
                "USER_READ",
                "EMPLOYEE_READ"
        );

        Map<String, Set<String>> mapping = new LinkedHashMap<>();
        mapping.put(SUPER_ADMIN, allPermissions);
        mapping.put(ADMIN, allPermissions);
        mapping.put(MANAGER, managerPermissions);
        mapping.put(EMPLOYEE, employeePermissions);
        return mapping;
    }
}
