package com.naren.erpbackend.user.service;


import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
import com.naren.erpbackend.user.repository.RoleRepository;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserRoleServiceImpl implements UserRoleService {

    private final UserProfileRepository userRepository;
    private final RoleRepository roleRepository;
    private final RoleResponseMapper responseMapper;

    @Override
    public void assignRole(Long userId, Long roleId) {
        log.info("Assign role: userId={}, roleId={}", userId, roleId);

        UserProfile userProfile = userRepository.findByIdAndStatusAndDeletedFalse
                        (userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role Not found"));

        userProfile.getRoles().add(role);
        userRepository.save(userProfile);
    }

    @Override
    public void removeRole(Long userId, Long roleId) {
        log.info("Remove role: userId={}, roleId={}", userId, roleId);

        UserProfile userProfile = userRepository.findByIdAndStatusAndDeletedFalse(userId,
                        UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResourceNotFoundException("Role Not found"));

        userProfile.getRoles().remove(role);
        userRepository.save(userProfile);
    }

    @Override
    public Set<RoleResponse> getUserRoles(Long userId) {
        log.info("Get user roles: userId={}", userId);
        UserProfile userProfile = userRepository.findByIdAndStatusAndDeletedFalse(userId,
                        UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userProfile
                .getRoles()
                .stream().map(responseMapper)
                .collect(java.util.stream.Collectors.toSet());
    }

    @Override
    public RoleResponse getUserRole(Long userId, Long roleId) {
        log.info("Get user role: userId={}, roleId={}", userId, roleId);
        UserProfile userProfile = userRepository.findByIdAndStatusAndDeletedFalse(userId,
                        UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userProfile.getRoles().stream()
                .filter(role -> role.getId().equals(roleId))
                .map(responseMapper)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Role not found for user"));
    }

    @Override
    public boolean hasRole(Long userId, Long roleId) {
        log.info("Check if user has role: userId={}, roleId={}", userId, roleId);
        UserProfile userProfile = userRepository.findByIdAndStatusAndDeletedFalse(userId,
                        UserStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userProfile.getRoles().stream()
                .anyMatch(role -> role.getId().equals(roleId));
    }
}
