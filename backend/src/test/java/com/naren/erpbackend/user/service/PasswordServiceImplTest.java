package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.InvalidPasswordException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.ChangePasswordRequest;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasswordServiceImplTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private PasswordServiceImpl passwordService;

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

        passwordService.changePassword(userId, req);

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

        assertThatThrownBy(() -> passwordService.changePassword(userId, req))
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

        assertThatThrownBy(() -> passwordService.changePassword(userId, req))
                .isInstanceOf(InvalidPasswordException.class)
                .hasMessageContaining("New password must be different");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void shouldThrowWhenUserNotFoundOnPasswordChange() {
        when(userProfileRepository.findById(99L)).thenReturn(Optional.empty());

        ChangePasswordRequest req = new ChangePasswordRequest("OldPass1", "NewPass123");

        assertThatThrownBy(() -> passwordService.changePassword(99L, req))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }
}
