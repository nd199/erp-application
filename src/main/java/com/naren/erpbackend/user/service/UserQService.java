package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface UserQService {

    UserResponse fetchUserById(Long id);

    UserResponse fetchUserByUsername(String username);

    UserResponse fetchUserByEmail(String email);

    Page<UserResponse> findAllUsers(Pageable pageable);

    Page<UserResponse> searchUsers(String keyword, Pageable pageable);
}