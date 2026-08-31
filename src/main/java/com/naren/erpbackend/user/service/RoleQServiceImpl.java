package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleQServiceImpl implements RoleQService {

    private final RoleRepository roleRepository;

    private final RoleResponseMapper roleResponseMapper;

    @Override
    public RoleResponse findRoleById(Long roleId) {
        log.info("Entering findRoleById with id: {}", roleId);
        Role role = roleRepository.findById(roleId)
                .orElseThrow(
                        () -> new IllegalArgumentException("Role not found")
                );

        RoleResponse response = roleResponseMapper.apply(role);
        log.info("Exiting findRoleById");
        return response;
    }

    @Override
    public Page<RoleResponse> findAllRoles(Pageable pageable) {
        log.info("Entering findAllRoles with pageable: {}", pageable);
        Page<RoleResponse> responses = roleRepository.findAll(pageable)
                .map(roleResponseMapper);
        log.info("Exiting findAllRoles");
        return responses;
    }

    @Override
    public Page<RoleResponse> searchRoles(String keyword, Pageable pageable) {
        log.info("Entering searchRoles with keyword: {} and pageable: {}", keyword, pageable);
        Page<RoleResponse> responses = roleRepository.searchRoles(keyword, pageable)
                .map(roleResponseMapper);
        log.info("Exiting searchRoles");
        return responses;
    }
}