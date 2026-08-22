package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.UserResponse;

public interface UserStatusService {

    UserResponse activateUser(Long userId);

    UserResponse deactivateUser(Long userId);

    UserResponse lockUser(Long userId);

    UserResponse unlockUser(Long userId);
}