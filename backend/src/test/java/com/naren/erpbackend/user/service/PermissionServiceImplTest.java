package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.user.entity.Permission;
import com.naren.erpbackend.user.repository.PermissionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PermissionServiceImplTest {

    @Mock
    private PermissionRepository permissionRepository;

    private PermissionServiceImpl permissionService;

    @BeforeEach
    void setUp() {
        permissionService = new PermissionServiceImpl(permissionRepository);
    }

    @Test
    void createPermission() {
        //Arrange
        String name = "READ";
        String description = "Read permission";
        Permission permission = Permission.builder().name(name).description(description).build();

        when(permissionRepository.existsByName(name)).thenReturn(false);
        when(permissionRepository.save(any(Permission.class))).thenReturn(permission);

        //Act
        Permission savedPermission = permissionService.createPermission(name, description);

        //Assert
        assertThat(savedPermission).isNotNull();
        assertThat(savedPermission.getName()).isEqualTo(name);
    }

    @Test
    void createPermissionFailsIfPermissionExists() {
        //Arrange
        String name = "READ";
        String description = "Read permission";

        when(permissionRepository.existsByName(name)).thenReturn(true);

        //Act + Assert
        assertThatThrownBy(() -> permissionService.createPermission(name, description))
                .isInstanceOf(ResourceExistsException.class)
                .hasMessage("Permission already exists: " + name);

        verify(permissionRepository, never()).save(any(Permission.class));
    }

    @Test
    void findByName() {
        //Arrange
        String name = "READ";
        Permission permission = Permission.builder().name(name).build();

        when(permissionRepository.findByName(name)).thenReturn(Optional.of(permission));

        //Act
        Permission foundPermission = permissionService.findByName(name);

        //Assert
        assertThat(foundPermission).isNotNull();
        assertThat(foundPermission.getName()).isEqualTo(name);
    }

    @Test
    void findByNameFailsIfPermissionNotFound() {
        //Arrange
        String name = "READ";

        when(permissionRepository.findByName(name)).thenReturn(Optional.empty());

        //Act + Assert
        assertThatThrownBy(() -> permissionService.findByName(name))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Permission not found: " + name);
    }
}