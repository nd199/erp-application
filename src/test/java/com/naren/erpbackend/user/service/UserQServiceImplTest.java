package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.UserNotFoundException;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

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

    private UserQServiceImpl userQService;

    @BeforeEach
    void setUp() {
        userQService = new UserQServiceImpl(
                userProfileRepository, userResponseMapper
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
                .isInstanceOf(UserNotFoundException.class)
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
                .isInstanceOf(UserNotFoundException.class)
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
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User Not found with email: " + email);

        // Verify
        verify(userProfileRepository).findByEmail(email);
    }

}