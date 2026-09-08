package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.PermissionResponseMapper;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceImplTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private RoleResponseMapper roleResponseMapper;

    @Mock
    private PermissionResponseMapper permissionResponseMapper;

    private RoleServiceImpl roleService;

    @BeforeEach
    void setUp() {
        roleService = new RoleServiceImpl(
                roleRepository,
                permissionRepository,
                userProfileRepository,
                roleResponseMapper,
                permissionResponseMapper
        );
    }

    @Test
    void addPermission() {
        //Arrange
        Long roleId = 1L;
        Long permissionId = 1L;
        Role role = Role.builder().id(roleId).permissions(new HashSet<>()).build();
        Permission permission = Permission.builder().id(permissionId).build();

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(permissionId)).thenReturn(Optional.of(permission));

        //Act
        roleService.addPermission(roleId, permissionId);

        //Assert
        verify(roleRepository).save(role);
        assertThat(role.getPermissions()).contains(permission);
    }

    @Test
    void addPermissionFailsIfRoleNotFound() {
        Long roleId = 1L;
        Long permissionId = 1L;

        when(roleRepository.findById(roleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.addPermission(roleId, permissionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Role not found");

        verify(roleRepository, never()).save(any(Role.class));
    }

    @Test
    void addPermissionFailsIfPermissionNotFound() {
        Long roleId = 1L;
        Long permissionId = 1L;
        Role role = Role.builder().id(roleId).permissions(new HashSet<>()).build();

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(permissionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.addPermission(roleId, permissionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Permission not found");

        verify(roleRepository, never()).save(any(Role.class));
    }

    @Test
    void removePermission() {
        //Arrange
        Long roleId = 1L;
        Long permissionId = 1L;
        Permission permission = Permission.builder().id(permissionId).build();
        Set<Permission> permissions = new HashSet<>();
        permissions.add(permission);
        Role role = Role.builder().id(roleId).permissions(permissions).build();

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(permissionId)).thenReturn(Optional.of(permission));

        //Act
        roleService.removePermission(roleId, permissionId);

        //Assert
        verify(roleRepository).save(role);
        assertThat(role.getPermissions()).doesNotContain(permission);
    }

    @Test
    void removePermissionFailsIfNotAssigned() {
        Long roleId = 1L;
        Long permissionId = 1L;
        Permission permission = Permission.builder().id(permissionId).build();
        Role role = Role.builder().id(roleId).permissions(new HashSet<>()).build();

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(permissionRepository.findById(permissionId)).thenReturn(Optional.of(permission));

        assertThatThrownBy(() -> roleService.removePermission(roleId, permissionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Permission is not assigned to role");

        verify(roleRepository, never()).save(any(Role.class));
    }

    @Test
    void assignRoleToUser() {
        //Arrange
        Long userId = 1L;
        Long roleId = 1L;
        UserProfile user = UserProfile.builder().id(userId).roles(new HashSet<>()).build();
        Role role = Role.builder().id(roleId).build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        //Act
        roleService.assignRoleToUser(userId, roleId);

        //Assert
        verify(userProfileRepository).save(user);
        assertThat(user.getRoles()).contains(role);
    }

    @Test
    void assignRoleToUserIsIdempotent() {
        Long userId = 1L;
        Long roleId = 1L;
        Role role = Role.builder().id(roleId).build();
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        UserProfile user = UserProfile.builder().id(userId).roles(roles).build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        roleService.assignRoleToUser(userId, roleId);

        verify(userProfileRepository, never()).save(any(UserProfile.class));
    }

    @Test
    void assignRoleToUserFailsIfRoleNotFound() {
        Long userId = 1L;
        Long roleId = 1L;

        when(roleRepository.findById(roleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.assignRoleToUser(userId, roleId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Role not found");

        verify(userProfileRepository, never()).save(any(UserProfile.class));
    }

    @Test
    void assignRoleToUserFailsIfUserNotFound() {
        Long userId = 1L;
        Long roleId = 1L;
        Role role = Role.builder().id(roleId).build();

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(userProfileRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleService.assignRoleToUser(userId, roleId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");

        verify(userProfileRepository, never()).save(any(UserProfile.class));
    }

    @Test
    void removeRoleFromUser() {
        //Arrange
        Long userId = 1L;
        Long roleId = 1L;
        Role role = Role.builder().id(roleId).build();
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        UserProfile user = UserProfile.builder().id(userId).roles(roles).build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        //Act
        roleService.removeRoleFromUser(userId, roleId);

        //Assert
        verify(userProfileRepository).save(user);
        assertThat(user.getRoles()).doesNotContain(role);
    }

    @Test
    void removeRoleFromUserFailsIfNotAssigned() {
        Long userId = 1L;
        Long roleId = 1L;
        Role role = Role.builder().id(roleId).build();
        UserProfile user = UserProfile.builder().id(userId).roles(new HashSet<>()).build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        assertThatThrownBy(() -> roleService.removeRoleFromUser(userId, roleId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Role is not assigned to user");

        verify(userProfileRepository, never()).save(any(UserProfile.class));
    }
}
