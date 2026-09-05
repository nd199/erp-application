package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.ChangePasswordRequest;
import org.springframework.transaction.annotation.Transactional;

public interface PasswordService {

    @Transactional
    void changePassword(Long userId, ChangePasswordRequest request);
}