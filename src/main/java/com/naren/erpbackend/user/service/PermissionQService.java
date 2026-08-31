package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.PermissionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PermissionQService {

    PermissionResponse findPermissionById(Long id);

    Page<PermissionResponse> findAllPermissions(Pageable pageable);

    Page<PermissionResponse> searchPermissions(String keyword, Pageable pageable);

}
