package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.UserNotFoundException;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserResponseMapper;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserQServiceImpl implements UserQService {

    private final UserProfileRepository repository;

    private final UserResponseMapper userResponseMapper;

    @Override
    public UserResponse fetchUserById(Long id) {


        UserProfile user = repository.findById(id).orElseThrow(
                () -> new UserNotFoundException("User Not found with id: " + id)
        );

        return userResponseMapper.apply(user);
    }

    @Override
    public UserResponse fetchUserByUsername(String username) {

        if (username == null) {
            throw new ValidationException("username is required");
        }

        UserProfile user = repository.findByUsername(username).orElseThrow(
                () -> new UserNotFoundException("User Not found with username: " + username)
        );

        return userResponseMapper.apply(user);
    }

    @Override
    public UserResponse fetchUserByEmail(String email) {

        if (email == null) {
            throw new ValidationException("email is required");
        }

        UserProfile user = repository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User Not found with email: " + email)
        );

        return userResponseMapper.apply(user);
    }
}