package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.UserExistsException;
import com.naren.erpbackend.user.dto.RegRequest;
import com.naren.erpbackend.user.dto.RegResponse;
import com.naren.erpbackend.user.dto.RegResponseMapper;
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

import java.time.Instant;

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

    private UserMServiceImpl userService;

    @BeforeEach
    void setUp() {
        userService = new UserMServiceImpl(
                userProfileRepository, passwordEncoder,
                new RegResponseMapper()
        );
    }

    @Test
    void registersUserWithTrimmedLowercasedAndEncodedValues() {
        RegRequest request = new RegRequest("  John.Doe  ",
                "  JOHN@Example.COM ", "RawPass123");

        when(userProfileRepository.existsByUsername("John.Doe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("RawPass123")).thenReturn("$2a$12$encodedHash");
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> {
            UserProfile userProfile = invocation.getArgument(0);
            userProfile.setId(42L);
            userProfile.setCreatedAt(Instant.parse("2026-08-20T00:00:00Z"));
            userProfile.setLastUpdated(Instant.parse("2026-08-20T00:00:00Z"));
            return userProfile;
        });

        RegResponse response = userService.registerUser(request);

        assertThat(response.username()).isEqualTo("John.Doe");
        assertThat(response.email()).isEqualTo("john@example.com");
        assertThat(response.created_at()).isNotNull();

        verify(passwordEncoder).encode("RawPass123");
        verify(userProfileRepository).save(any(UserProfile.class));
    }

    @Test
    void persistsBcryptHashInsteadOfRawPassword() {
        RegRequest request = new RegRequest("johndoe", "john@example.com", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$encodedHash");
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        userService.registerUser(request);

        ArgumentCaptor<UserProfile> captor = ArgumentCaptor.forClass(UserProfile.class);
        verify(userProfileRepository).save(captor.capture());
        assertThat(captor.getValue().getPassword())
                .isEqualTo("$2a$12$encodedHash")
                .isNotEqualTo("RawPass123");
    }

    @Test
    void rejectsDuplicateUsername() {
        RegRequest request = new RegRequest("johndoe", "john@example.com", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(UserExistsException.class)
                .hasMessageContaining("already exists");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void rejectsDuplicateEmail() {
        RegRequest request = new RegRequest("johndoe", "john@example.com", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(UserExistsException.class)
                .hasMessageContaining("already exists");

        verify(userProfileRepository, never()).save(any());
    }

    @Test
    void translatesConcurrentUniqueConstraintViolation() {
        RegRequest request = new RegRequest("johndoe", "john@example.com", "RawPass123");

        when(userProfileRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userProfileRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userProfileRepository.save(any(UserProfile.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key value violates unique constraint"));

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(UserExistsException.class)
                .hasMessageContaining("already exists");
    }
}
