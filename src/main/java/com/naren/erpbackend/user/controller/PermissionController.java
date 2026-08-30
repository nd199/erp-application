package com.naren.erpbackend.user.controller;


import com.naren.erpbackend.user.dto.CreatePermissionRequest;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.service.PermissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    public ResponseEntity<PermissionResponse> createPermission(
            @Valid @RequestBody CreatePermissionRequest request) {

        Permission permission =
                permissionService.createPermission(
                        request.name(),
                        request.description()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new PermissionResponse(
                                permission.getId(),
                                permission.getName(),
                                permission.getDescription()
                        )
                );

    }
}
