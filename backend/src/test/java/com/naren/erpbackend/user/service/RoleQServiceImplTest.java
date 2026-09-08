package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoleQServiceImplTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private RoleResponseMapper roleResponseMapper;

    @Mock
    private UserResponseMapper userResponseMapper;

    private RoleQServiceImpl roleQService;

    @BeforeEach
    void setUp() {
        roleQService = new RoleQServiceImpl(
                roleRepository, permissionRepository, roleResponseMapper, userResponseMapper
        );
    }

    @Test
    void findUsersByRole() {
        Long roleId = 1L;

        UserProfile user1 = UserProfile.builder()
                .id(1L)
                .username("user1")
                .build();

        UserProfile user2 = UserProfile.builder()
                .id(2L)
                .username("user2")
                .build();

        Set<UserProfile> users = new HashSet<>(Set.of(user1, user2));

        Role role = Role.builder()
                .id(roleId)
                .name("ROLE_ADMIN")
                .users(users)
                .build();

        UserResponse response1 = new UserResponse(1L, "user1", null, null, null, null, null, null);
        UserResponse response2 = new UserResponse(2L, "user2", null, null, null, null, null, null);

        when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        when(userResponseMapper.apply(user1)).thenReturn(response1);
        when(userResponseMapper.apply(user2)).thenReturn(response2);

        Set<UserResponse> result = roleQService.findUsersByRole(roleId);

        assertThat(result).hasSize(2);
        assertThat(result).contains(response1, response2);

        verify(roleRepository).findById(roleId);
    }

    @Test
    void findUsersByRoleThrowsWhenRoleNotFound() {
        Long roleId = 99L;

        when(roleRepository.findById(roleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roleQService.findUsersByRole(roleId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Role not found: " + roleId);

        verify(roleRepository).findById(roleId);
    }
}