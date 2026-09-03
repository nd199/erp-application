package com.naren.erpbackend.user.bootstrap;

import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SystemAuthorizationSeederTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    private SystemAuthorizationSeeder seeder;
    private Map<String, Role> roleStore;
    private Map<String, Permission> permissionStore;
    private AtomicLong roleIdSeq;
    private AtomicLong permIdSeq;

    @BeforeEach
    void setUp() {
        seeder = new SystemAuthorizationSeeder(roleRepository, permissionRepository);
        roleStore = new HashMap<>();
        permissionStore = new HashMap<>();
        roleIdSeq = new AtomicLong(0);
        permIdSeq = new AtomicLong(0);
    }

    private void wireExistenceAndLookup() {
        when(permissionRepository.existsByName(any())).thenAnswer(inv -> {
            String name = inv.getArgument(0);
            return permissionStore.containsKey(name);
        });
        when(permissionRepository.findByName(any())).thenAnswer(inv -> {
            String name = inv.getArgument(0);
            return Optional.ofNullable(permissionStore.get(name));
        });
        when(roleRepository.existsByName(any())).thenAnswer(inv -> {
            String name = inv.getArgument(0);
            return roleStore.containsKey(name);
        });
        when(roleRepository.findByName(any())).thenAnswer(inv -> {
            String name = inv.getArgument(0);
            return Optional.ofNullable(roleStore.get(name));
        });

        when(permissionRepository.save(any(Permission.class))).thenAnswer(inv -> {
            Permission p = inv.getArgument(0);
            if (p.getId() == null) {
                p.setId(permIdSeq.incrementAndGet());
            }
            permissionStore.put(p.getName(), p);
            return p;
        });
        when(roleRepository.save(any(Role.class))).thenAnswer(inv -> {
            Role r = inv.getArgument(0);
            if (r.getId() == null) {
                r.setId(roleIdSeq.incrementAndGet());
            }
            Role existing = roleStore.get(r.getName());
            if (existing != null) {
                existing.getPermissions().addAll(r.getPermissions());
                return existing;
            }
            roleStore.put(r.getName(), r);
            return r;
        });
    }

    @Test
    void shouldCreateAllSystemPermissions() throws Exception {
        wireExistenceAndLookup();

        seeder.run();

        Set<String> names = permissionStore.keySet();

        assertThat(names).contains(
                "USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE",
                "USER_ACTIVATE", "USER_DEACTIVATE", "USER_LOCK", "USER_UNLOCK",
                "USER_CHANGE_PASSWORD",
                "ROLE_READ", "ROLE_ASSIGN", "ROLE_REMOVE",
                "PERMISSION_READ", "PERMISSION_ASSIGN", "PERMISSION_REMOVE",
                "EMPLOYEE_CREATE", "EMPLOYEE_READ", "EMPLOYEE_UPDATE", "EMPLOYEE_DELETE"
        );

        verify(permissionRepository, times(19)).save(any(Permission.class));
    }

    @Test
    void shouldCreateAllSystemRoles() throws Exception {
        wireExistenceAndLookup();

        seeder.run();

        assertThat(roleStore.keySet()).contains("SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE");

        verify(roleRepository, times(8)).save(any(Role.class));
    }

    @Test
    void shouldBeIdempotentWhenRolesAndPermissionsAlreadyExist() throws Exception {
        wireExistenceAndLookup();

        seeder.run();

        int rolesAfterFirstRun = roleStore.size();
        int permsAfterFirstRun = permissionStore.size();

        seeder.run();

        assertThat(roleStore).hasSize(rolesAfterFirstRun);
        assertThat(permissionStore).hasSize(permsAfterFirstRun);
    }

    @Test
    void shouldBindPermissionsToRoles() throws Exception {
        wireExistenceAndLookup();

        seeder.run();

        Role superAdmin = roleStore.get("SUPER_ADMIN");
        Role admin = roleStore.get("ADMIN");
        Role manager = roleStore.get("MANAGER");
        Role employee = roleStore.get("EMPLOYEE");

        assertThat(superAdmin.getPermissions()).hasSize(19);
        assertThat(admin.getPermissions()).hasSize(19);
        assertThat(manager.getPermissions()).hasSize(6);
        assertThat(employee.getPermissions()).hasSize(2);

        Set<String> managerPerms = manager.getPermissions().stream()
                .map(Permission::getName)
                .collect(Collectors.toSet());
        assertThat(managerPerms).contains("USER_READ", "ROLE_READ", "PERMISSION_READ",
                "EMPLOYEE_CREATE", "EMPLOYEE_READ", "EMPLOYEE_UPDATE");

        Set<String> employeePerms = employee.getPermissions().stream()
                .map(Permission::getName)
                .collect(Collectors.toSet());
        assertThat(employeePerms).containsExactlyInAnyOrder("USER_READ", "EMPLOYEE_READ");
    }
}
