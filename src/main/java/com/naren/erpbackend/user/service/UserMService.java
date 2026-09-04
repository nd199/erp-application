package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.*;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface UserMService {

    @Transactional
    RegResponse registerUser(@Valid RegRequest regRequest);

    @Transactional
    UserResponse updateUser(Long userId, UserUpdateRequest userUpdateRequest);

    @Transactional
    void changePassword(Long userId, ChangePasswordRequest changePasswordRequest);

    @Transactional
    void deleteUser(Long userId);
}