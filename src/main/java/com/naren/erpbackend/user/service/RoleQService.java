package com.naren.erpbackend.user.service;


import com.naren.erpbackend.user.dto.RoleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoleQService {

    RoleResponse findRoleById(Long roleId);

    Page<RoleResponse> findAllRoles(Pageable pageable);

    Page<RoleResponse> searchRoles(String keyword, Pageable pageable);
}
