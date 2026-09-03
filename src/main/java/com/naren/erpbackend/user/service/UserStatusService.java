package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.UserResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface UserStatusService {

    @Transactional
    UserResponse activateUser(Long userId);

    @Transactional
    UserResponse deactivateUser(Long userId);

    @Transactional
    UserResponse lockUser(Long userId);

    @Transactional
    UserResponse unlockUser(Long userId);
}