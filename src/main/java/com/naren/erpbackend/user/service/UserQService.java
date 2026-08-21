package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.UserResponse;


public interface UserQService {

    UserResponse fetchUserById(Long id);

    UserResponse fetchUserByUsername(String username);

    UserResponse fetchUserByEmail(String email);
}