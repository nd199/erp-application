package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.InvalidPasswordException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.exception.UserExistsException;
import com.naren.erpbackend.user.dto.*;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserMServiceImplTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private final RegResponseMapper regResponseMapper = new RegResponseMapper();
    private final UserResponseMapper userResponseMapper = new UserResponseMapper();

    private UserMServiceImpl userService;

    @BeforeEach
    void setUp() {
        userService = new UserMServiceImpl(
                userProfileRepository, passwordEncoder,
                regResponseMapper, userResponseMapper
        );
    }

    @Test
    void shouldRegisterUserSuccessfully() {
        RegRequest request = new RegRequest(
                "johndoe", "john@example.com",
                "1234567890", "123 Main St", "RawPass123"
        );

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("RawPass123")).thenReturn("$2a$12$encodedHash");
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(
                invocation -> {
            UserProfile u = invocation.getArgument(0);
            u.setId(1L);
            u.setCreatedAt(java.time.Instant.now());
            return u;
        });

        RegResponse response = userService.registerUser(request);

        assertThat(response.username()).isEqualTo("johndoe");
        assertThat(response.email()).isEqualTo("john@example.com");
        assertThat(response.phone()).isEqualTo("1234567890");
        assertThat(response.address()).isEqualTo("123 Main St");
        assertThat(response.created_at()).isNotNull();
    }

    @Test
    void shouldTrimAndLowercaseEmailOnRegister() {
        RegRequest request = new RegRequest(
                "  JohnDoe  ", "  JOHN@Example.COM ", "1234567890", "123 Main St", "RawPass123");

        when(userProfileRepository.existsByUsername("JohnDoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("RawPass123")).thenReturn("$2a$12$encodedHash");
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> {
            UserProfile u = invocation.getArgument(0);
            u.setId(1L);
            u.setCreatedAt(java.time.Instant.now());
            return u;
        });

        RegResponse response = userService.registerUser(request);

        assertThat(response.username()).isEqualTo("JohnDoe");
        assertThat(response.email()).isEqualTo("john@example.com");
    }

    @Test
    void shouldStoreEncodedPassword_notRaw() {
        RegRequest request = new RegRequest(
                "johndoe", "john@example.com", "1234567890", "456 Oak Ave", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$encodedHash");
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.registerUser(request);

        ArgumentCaptor<UserProfile> captor = ArgumentCaptor.forClass(UserProfile.class);
        verify(userProfileRepository).save(captor.capture());

        assertThat(captor.getValue().getPassword()).isEqualTo("$2a$12$encodedHash");
        assertThat(captor.getValue().getPassword()).isNotEqualTo("RawPass123");
    }

    @Test
    void shouldThrowIfUsernameAlreadyTaken() {
        RegRequest request = new RegRequest(
                "johndoe", "john@example.com", "1234567890", "789 Pine Rd", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(UserExistsException.class)
                .hasMessageContaining("already exists");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void shouldThrowIfEmailAlreadyTaken() {
        RegRequest request = new RegRequest(
                "johndoe", "john@example.com", "1234567890", "789 Pine Rd", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(UserExistsException.class)
                .hasMessageContaining("already exists");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void shouldHandleRaceConditionOnSave() {
        RegRequest request = new RegRequest(
                "johndoe", "john@example.com", "1234567890", "789 Pine Rd", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userProfileRepository.save(any(UserProfile.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(UserExistsException.class)
                .hasMessageContaining("already exists");
    }

    // ==================== updateUser ====================

    @Test
    void shouldUpdateUserFields() {
        Long userId = 1L;
        UserProfile existing = UserProfile.builder()
                .id(userId)
                .username("johndoe")
                .email("john@example.com")
                .phone("1234567890")
                .address("old address")
                .password("irrelevant")
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(existing));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        UserUpdateRequest updateReq = new UserUpdateRequest(
                null, null, null, "new address");

        UserResponse response = userService.updateUser(userId, updateReq);

        assertThat(response.address()).isEqualTo("new address");
        verify(userProfileRepository).save(any());
    }

    @Test
    void shouldNotSaveIfNothingChanged() {
        Long userId = 1L;
        UserProfile existing = UserProfile.builder()
                .id(userId)
                .username("johndoe")
                .email("john@example.com")
                .phone("1234567890")
                .address("123 Main St")
                .password("irrelevant")
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(existing));

        UserUpdateRequest sameValues = new UserUpdateRequest(
                "johndoe", "john@example.com", "1234567890", "123 Main St");

        userService.updateUser(userId, sameValues);

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void shouldThrowWhenUserNotFoundOnUpdate() {
        when(userProfileRepository.findById(99L)).thenReturn(Optional.empty());

        UserUpdateRequest updateReq = new UserUpdateRequest(
                "newname", null, null, null);

        assertThatThrownBy(() -> userService.updateUser(99L, updateReq))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void shouldTrimAndLowercaseOnUpdate() {
        Long userId = 1L;
        UserProfile existing = UserProfile.builder()
                .id(userId)
                .username("johndoe")
                .email("john@example.com")
                .phone("1234567890")
                .address("old addr")
                .password("irrelevant")
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(existing));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        UserUpdateRequest updateReq = new UserUpdateRequest(
                "  NEWUSER  ", "  NEW@EMAIL.COM ", null, null);

        UserResponse response = userService.updateUser(userId, updateReq);

        assertThat(response.username()).isEqualTo("NEWUSER");
        assertThat(response.email()).isEqualTo("new@email.com");
    }

    @Test
    void shouldThrowOnDuplicateEmailDuringUpdate() {
        Long userId = 1L;
        UserProfile existing = UserProfile.builder()
                .id(userId)
                .username("johndoe")
                .email("john@example.com")
                .phone("1234567890")
                .address("addr")
                .password("irrelevant")
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(existing));
        when(userProfileRepository.save(any(UserProfile.class)))
                .thenThrow(new DataIntegrityViolationException("unique constraint"));

        UserUpdateRequest updateReq = new UserUpdateRequest(
                null, "taken@email.com", null, null);

        assertThatThrownBy(() -> userService.updateUser(userId, updateReq))
                .isInstanceOf(UserExistsException.class)
                .hasMessageContaining("already exists");
    }

    // ==================== changePassword ====================

    @Test
    void shouldChangePasswordSuccessfully() {
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .username("johndoe")
                .password("oldEncodedPass")
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("OldPass1", "oldEncodedPass")).thenReturn(true);
        when(passwordEncoder.matches("NewPass123", "oldEncodedPass")).thenReturn(false);
        when(passwordEncoder.encode("NewPass123")).thenReturn("newEncodedPass");

        ChangePasswordRequest req = new ChangePasswordRequest("OldPass1", "NewPass123");

        userService.changePassword(userId, req);

        assertThat(user.getPassword()).isEqualTo("newEncodedPass");
        verify(userProfileRepository).save(user);
    }

    @Test
    void shouldRejectChangeIfOldPasswordWrong() {
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .password("oldEncodedPass")
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPass", "oldEncodedPass")).thenReturn(false);

        ChangePasswordRequest req = new ChangePasswordRequest("WrongPass", "NewPass123");

        assertThatThrownBy(() -> userService.changePassword(userId, req))
                .isInstanceOf(InvalidPasswordException.class)
                .hasMessageContaining("Old password is incorrect");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void shouldRejectChangeIfNewPasswordSameAsOld() {
        Long userId = 1L;
        UserProfile user = UserProfile.builder()
                .id(userId)
                .password("oldEncodedPass")
                .build();

        when(userProfileRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("SamePass1", "oldEncodedPass")).thenReturn(true);

        ChangePasswordRequest req = new ChangePasswordRequest("SamePass1", "SamePass1");

        assertThatThrownBy(() -> userService.changePassword(userId, req))
                .isInstanceOf(InvalidPasswordException.class)
                .hasMessageContaining("New password must be different");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void shouldThrowWhenUserNotFoundOnPasswordChange() {
        when(userProfileRepository.findById(99L)).thenReturn(Optional.empty());

        ChangePasswordRequest req = new ChangePasswordRequest("OldPass1", "NewPass123");

        assertThatThrownBy(() -> userService.changePassword(99L, req))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }
}
