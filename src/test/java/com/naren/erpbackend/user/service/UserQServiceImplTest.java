package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class UserQServiceImplTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserResponseMapper userResponseMapper;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    private UserQServiceImpl userQService;

    @BeforeEach
    void setUp() {
        userQService = new UserQServiceImpl(
                userProfileRepository, userResponseMapper,
                roleRepository, permissionRepository
        );
    }

    @Test
    void fetchUserById() {
        //Arrange
        Long id = 1L;

        UserProfile user = UserProfile
                .builder()
                .id(id)
                .username("testuser")
                .email("test@example.com")
                .build();

        UserResponse expectedResponse = new UserResponse(
                id,
                "testuser",
                "test@example.com",
                null,
                null,
                UserStatus.ACTIVE,
                null,
                null
        );

        when(userProfileRepository.findById(id))
                .thenReturn(Optional.of(user));

        when(userResponseMapper.apply(user))
                .thenReturn(expectedResponse);

        //Act
        UserResponse response = userQService.fetchUserById(id);

        //Assert
        verify(userProfileRepository).findById(id);

        assertThat(response.id()).isEqualTo(id);
        assertThat(response.username()).isEqualTo("testuser");
        assertThat(response.email()).isEqualTo("test@example.com");
    }

    @Test
    void fetchUserByIdFailsIfUserNotFound() {
        //Arrange
        Long id = 1L;
        when(userProfileRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act + Assert
        assertThatThrownBy(() -> userQService.fetchUserById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User Not found with id: " + id);

        verify(userProfileRepository).findById(id);
    }

    @Test
    void fetchUserByUsername() {
        //Arrange
        String username = "testuser";
        UserProfile user = UserProfile
                .builder()
                .username(username)
                .email("test@example.com")
                .build();

        UserResponse expectedResponse = new UserResponse(
                1L,
                username,
                "test@example.com",
                null,
                null,
                UserStatus.ACTIVE,
                null,
                null
        );

        when(userProfileRepository.findByUsername(username))
                .thenReturn(Optional.of(user));

        when(userResponseMapper.apply(user))
                .thenReturn(expectedResponse);


        //Act
        UserResponse response = userQService.fetchUserByUsername(username);

        //Assert
        verify(userProfileRepository).findByUsername(username);
        assertThat(response.username()).isEqualTo(username);
        assertThat(response.email()).isEqualTo("test@example.com");
    }

    @Test
    void fetchUserByUsernameFailsIfUserNotFound() {

        // Arrange
        String username = "testuser";
        when(userProfileRepository.findByUsername(username))
                .thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() ->
                userQService.fetchUserByUsername(username))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User Not found with username: " + username);

        // Verify
        verify(userProfileRepository).findByUsername(username);
    }


    @Test
    void fetchUserByEmail() {
        //Arrange
        String email = "test@example.com";
        UserProfile user = UserProfile
                .builder()
                .email(email)
                .build();

        UserResponse expectedResponse = new UserResponse(
                1L,
                "testuser",
                email,
                null,
                null,
                UserStatus.ACTIVE,
                null,
                null
        );

        when(userProfileRepository.findByEmail(email))
                .thenReturn(Optional.of(user));

        when(userResponseMapper.apply(user))
                .thenReturn(expectedResponse);

        //Act
        UserResponse response = userQService.fetchUserByEmail(email);

        //Assert
        verify(userProfileRepository).findByEmail(email);
        assertThat(response.email()).isEqualTo(email);
        assertThat(response.username()).isEqualTo("testuser");
        assertThat(response.id()).isEqualTo(1L);
    }


    @Test
    void fetchUserByEmailFailsIfUserNotFound() {

        // Arrange
        String email = "test@example.com";
        when(userProfileRepository.findByEmail(email))
                .thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() ->
                userQService.fetchUserByEmail(email))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User Not found with email: " + email);

        // Verify
        verify(userProfileRepository).findByEmail(email);
    }

    @Test
    void hasPermissionReturnsTrueWhenAnyRoleContainsThePermission() {
        Long userId = 1L;
        Long permissionId = 10L;

        Permission permission = Permission.builder().id(permissionId).name("USER_READ").build();
        Role role = Role.builder()
                .id(1L)
                .name("ADMIN")
                .permissions(new HashSet<>(Set.of(permission)))
                .build();
        UserProfile user = UserProfile.builder()
                .id(userId)
                .roles(new HashSet<>(Set.of(role)))
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(permissionRepository.findById(permissionId)).thenReturn(Optional.of(permission));

        boolean result = userQService.hasPermission(userId, permissionId);

        assertThat(result).isTrue();
    }

    @Test
    void hasPermissionReturnsFalseWhenNoRoleContainsThePermission() {
        Long userId = 1L;
        Long permissionId = 10L;

        Permission permission = Permission.builder().id(permissionId).name("USER_READ").build();
        Role role = Role.builder()
                .id(1L)
                .name("EMPLOYEE")
                .permissions(new HashSet<>())
                .build();
        UserProfile user = UserProfile.builder()
                .id(userId)
                .roles(new HashSet<>(Set.of(role)))
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(permissionRepository.findById(permissionId)).thenReturn(Optional.of(permission));

        boolean result = userQService.hasPermission(userId, permissionId);

        assertThat(result).isFalse();
    }

    @Test
    void hasPermissionThrowsWhenUserNotFound() {
        when(userProfileRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userQService.hasPermission(1L, 10L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User Not found with id: 1");
    }

    @Test
    void hasPermissionThrowsWhenPermissionNotFound() {
        UserProfile user = UserProfile.builder()
                .id(1L)
                .username("u")
                .build();

        when(userProfileRepository.findById(1L)).thenReturn(Optional.of(user));
        when(permissionRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userQService.hasPermission(1L, 10L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Permission not found");
    }

}