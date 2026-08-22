package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.*;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

public interface UserMService {

    RegResponse registerUser(@Valid RegRequest regRequest);

    UserResponse updateUser(Long userId, UserUpdateRequest userUpdateRequest);

    void changePassword(Long userId, ChangePasswordRequest changePasswordRequest);
}
