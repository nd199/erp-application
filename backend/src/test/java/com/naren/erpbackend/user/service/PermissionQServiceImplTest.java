package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.dto.PermissionResponse;
import com.naren.erpbackend.user.dto.PermissionResponseMapper;
import com.naren.erpbackend.user.dto.RoleResponse;
import com.naren.erpbackend.user.dto.RoleResponseMapper;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.repository.PermissionRepository;
import com.naren.erpbackend.user.repository.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PermissionQServiceImplTest {

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private PermissionResponseMapper permissionMapper;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RoleResponseMapper roleResponseMapper;

    private PermissionQServiceImpl permissionQService;

    @BeforeEach
    void setUp() {
        permissionQService = new PermissionQServiceImpl(
                permissionRepository, permissionMapper, roleRepository, roleResponseMapper
        );
    }

    @Test
    void findPermissionById() {
        //Arrange
        Long id = 1L;

        Permission permission = Permission
                .builder()
                .id(id)
                .name("READ")
                .build();

        PermissionResponse expectedResponse = new PermissionResponse(
                id,
                "READ",
                "Read permission"
        );

        when(permissionRepository.findById(id))
                .thenReturn(Optional.of(permission));

        when(permissionMapper.apply(permission))
                .thenReturn(expectedResponse);

        //Act
        PermissionResponse response = permissionQService.findPermissionById(id);

        //Assert
        verify(permissionRepository).findById(id);

        assertThat(response.id()).isEqualTo(id);
        assertThat(response.name()).isEqualTo("READ");
    }

    @Test
    void findPermissionByIdFailsIfPermissionNotFound() {
        //Arrange
        Long id = 1L;
        when(permissionRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act + Assert
        assertThatThrownBy(() -> permissionQService.findPermissionById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Permission not found with id: " + id);

        verify(permissionRepository).findById(id);
    }

    @Test
    void findAllPermissions() {
        //Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Permission permission = Permission.builder().id(1L).name("READ").build();
        Page<Permission> permissionPage = new PageImpl<>(Collections.singletonList(permission));
        PermissionResponse permissionResponse = new PermissionResponse(1L, "READ", "Read Permission");

        when(permissionRepository.findAll(pageable)).thenReturn(permissionPage);
        when(permissionMapper.apply(permission)).thenReturn(permissionResponse);

        //Act
        Page<PermissionResponse> response = permissionQService.findAllPermissions(pageable);

        //Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalElements()).isEqualTo(1);
        assertThat(response.getContent().get(0).name()).isEqualTo("READ");
    }

    @Test
    void searchPermissions() {
        //Arrange
        String keyword = "READ";
        Pageable pageable = PageRequest.of(0, 10);
        Permission permission = Permission.builder().id(1L).name("READ").build();
        Page<Permission> permissionPage = new PageImpl<>(Collections.singletonList(permission));
        PermissionResponse permissionResponse = new PermissionResponse(1L, "READ", "Read permission");

        when(permissionRepository.searchPermissions(keyword, pageable)).thenReturn(permissionPage);
        when(permissionMapper.apply(permission)).thenReturn(permissionResponse);

        //Act
        Page<PermissionResponse> response = permissionQService.searchPermissions(keyword, pageable);

        //Assert
        assertThat(response).isNotNull();
        assertThat(response.getTotalElements()).isEqualTo(1);
        assertThat(response.getContent().get(0).name()).isEqualTo("READ");
    }

    @Test
    void findRolesByPermission() {
        Long permissionId = 1L;
        Role role = Role.builder().id(2L).name("ADMIN").build();
        RoleResponse roleResponse = new RoleResponse(2L, "ADMIN", "Admin role");

        when(permissionRepository.existsById(permissionId)).thenReturn(true);
        when(roleRepository.findRolesByPermissionId(permissionId)).thenReturn(Set.of(role));
        when(roleResponseMapper.apply(role)).thenReturn(roleResponse);

        Set<RoleResponse> result = permissionQService.findRolesByPermission(permissionId);

        assertThat(result).hasSize(1);
        assertThat(result).contains(roleResponse);
    }

    @Test
    void findRolesByPermissionFailsIfPermissionNotFound() {
        Long permissionId = 1L;
        when(permissionRepository.existsById(permissionId)).thenReturn(false);

        assertThatThrownBy(() -> permissionQService.findRolesByPermission(permissionId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Permission not found");
    }
}
