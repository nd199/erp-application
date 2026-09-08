package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.RegRequest;
import com.naren.erpbackend.user.dto.RegResponse;
import com.naren.erpbackend.user.dto.UserResponse;
import com.naren.erpbackend.user.dto.UserUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface UserMService {

    @Transactional
    RegResponse registerUser(@Valid RegRequest regRequest);

    @Transactional
    UserResponse updateUser(Long userId, UserUpdateRequest userUpdateRequest);

    @Transactional
    void deleteUser(Long userId);
}