package com.naren.erpbackend.user.dto;

import com.naren.erpbackend.user.entity.Permission;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class PermissionResponseMapper implements Function<Permission, PermissionResponse> {

    @Override
    public PermissionResponse apply(Permission permission) {
        return new PermissionResponse(
                permission.getId(),
                permission.getName(),
                permission.getDescription()
        );
    }
}
