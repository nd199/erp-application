package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.InvalidUserStateException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserStatusServiceImplTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserResponseMapper userResponseMapper;

    private UserStatusServiceImpl userStatusService;

    @BeforeEach
    void setUp() {
        userStatusService = new UserStatusServiceImpl(
                userProfileRepository, userResponseMapper
        );
    }

    @Test
    void activateUserFromInactive() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.INACTIVE)
                .build();

        UserResponse expectedResponse = new UserResponse(
                userId, "testuser", "test@example.com", null, null,
                UserStatus.ACTIVE, null, null
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userResponseMapper.apply(any(UserProfile.class))).thenReturn(expectedResponse);

        // Act
        UserResponse response = userStatusService.activateUser(userId);

        // Assert
        assertThat(response.status()).isEqualTo(UserStatus.ACTIVE);
        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    void activateUserFromLocked() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.LOCKED)
                .build();

        UserResponse expectedResponse = new UserResponse(
                userId, "testuser", "test@example.com", null, null,
                UserStatus.ACTIVE, null, null
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userResponseMapper.apply(any(UserProfile.class))).thenReturn(expectedResponse);

        // Act
        UserResponse response = userStatusService.activateUser(userId);

        // Assert
        assertThat(response.status()).isEqualTo(UserStatus.ACTIVE);
        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    void activateUserFromActiveThrowsException() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.ACTIVE)
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act + Assert
        assertThatThrownBy(() -> userStatusService.activateUser(userId))
                .isInstanceOf(InvalidUserStateException.class)
                .hasMessageContaining("Cannot transition from ACTIVE to ACTIVE");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void deactivateUserFromActive() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.ACTIVE)
                .build();

        UserResponse expectedResponse = new UserResponse(
                userId, "testuser", "test@example.com", null, null,
                UserStatus.INACTIVE, null, null
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userResponseMapper.apply(any(UserProfile.class))).thenReturn(expectedResponse);

        // Act
        UserResponse response = userStatusService.deactivateUser(userId);

        // Assert
        assertThat(response.status()).isEqualTo(UserStatus.INACTIVE);
        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    void deactivateUserFromInactiveThrowsException() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.INACTIVE)
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act + Assert
        assertThatThrownBy(() -> userStatusService.deactivateUser(userId))
                .isInstanceOf(InvalidUserStateException.class)
                .hasMessageContaining("Cannot transition from INACTIVE to INACTIVE");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void lockUserFromActive() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.ACTIVE)
                .build();

        UserResponse expectedResponse = new UserResponse(
                userId, "testuser", "test@example.com", null, null,
                UserStatus.LOCKED, null, null
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userResponseMapper.apply(any(UserProfile.class))).thenReturn(expectedResponse);

        // Act
        UserResponse response = userStatusService.lockUser(userId);

        // Assert
        assertThat(response.status()).isEqualTo(UserStatus.LOCKED);
        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    void lockUserFromLockedThrowsException() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.LOCKED)
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act + Assert
        assertThatThrownBy(() -> userStatusService.lockUser(userId))
                .isInstanceOf(InvalidUserStateException.class)
                .hasMessageContaining("Cannot transition from LOCKED to LOCKED");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void unlockUserFromLocked() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.LOCKED)
                .build();

        UserResponse expectedResponse = new UserResponse(
                userId, "testuser", "test@example.com", null, null,
                UserStatus.ACTIVE, null, null
        );

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userResponseMapper.apply(any(UserProfile.class))).thenReturn(expectedResponse);

        // Act
        UserResponse response = userStatusService.unlockUser(userId);

        // Assert
        assertThat(response.status()).isEqualTo(UserStatus.ACTIVE);
        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    void unlockUserFromActiveThrowsException() {
        // Arrange
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("testuser")
                .email("test@example.com")
                .status(UserStatus.ACTIVE)
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act + Assert
        assertThatThrownBy(() -> userStatusService.unlockUser(userId))
                .isInstanceOf(InvalidUserStateException.class)
                .hasMessageContaining("Cannot transition from ACTIVE to ACTIVE");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void activateUserNotFoundThrowsException() {
        // Arrange
        Long userId = 999L;
        when(userProfileRepository.findById(userId)).thenReturn(Optional.empty());

        // Act + Assert
        assertThatThrownBy(() -> userStatusService.activateUser(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found with id: " + userId);

        verify(userProfileRepository, never()).save(any());
    }
}