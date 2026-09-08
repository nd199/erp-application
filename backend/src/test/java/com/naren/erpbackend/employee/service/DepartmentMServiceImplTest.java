package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.DepartmentRequest;
import com.naren.erpbackend.employee.dto.DepartmentResponseMapper;
import com.naren.erpbackend.employee.entity.Department;
import com.naren.erpbackend.employee.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentMServiceImplTest {

    private final DepartmentResponseMapper responseMapper
            = new DepartmentResponseMapper();
    @Mock
    private DepartmentRepository departmentRepository;
    private DepartmentMServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new DepartmentMServiceImpl(
                departmentRepository, responseMapper
        );
    }

    @Test
    void createDepartment() {
        //Arrange
        DepartmentRequest departmentRequest
                = new DepartmentRequest(
                "Engineering",
                "Software development department");

        Department department =
                Department.builder()
                        .name(departmentRequest.name())
                        .description(departmentRequest.description())
                        .build();

        //Act
        when(departmentRepository.existsByName(departmentRequest
                .name())).thenReturn(false);

        when(departmentRepository.save(any(Department.class)))
                .thenReturn(department);

        underTest.createDepartment(departmentRequest);

        //Assert
        ArgumentCaptor<Department> captor = ArgumentCaptor.forClass(Department.class);
        verify(departmentRepository).save(captor.capture());

        assertThat(captor.getValue().getName()).isEqualTo("Engineering");
        assertThat(captor.getValue().getDescription()).isEqualTo("Software development department");
    }

    @Test
    void createDepartmentTrimsWhitespaceFromName() {
        //Arrange
        DepartmentRequest departmentRequest
                = new DepartmentRequest("  Engineering  ", "  Software dev  ");

        Department department =
                Department.builder()
                        .name("Engineering")
                        .description("Software dev")
                        .build();

        //Act
        when(departmentRepository.existsByName("Engineering"))
                .thenReturn(false);

        when(departmentRepository.save(any(Department.class)))
                .thenReturn(department);

        underTest.createDepartment(departmentRequest);

        //Assert
        ArgumentCaptor<Department> captor = ArgumentCaptor.forClass(Department.class);
        verify(departmentRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("Engineering");
        assertThat(captor.getValue().getDescription()).isEqualTo("Software dev");
    }

    @Test
    void createDepartmentThrowsWhenDepartmentWithNameIsPresent() {
        //Arrange
        DepartmentRequest departmentRequest
                = new DepartmentRequest(
                "Engineering",
                "Software development department");

        when(departmentRepository.existsByName(departmentRequest
                .name())).thenReturn(true);

        //Act
        assertThatThrownBy(() -> underTest.createDepartment(departmentRequest))
                .isInstanceOf(ResourceExistsException.class)
                .hasMessage("Department with name " + departmentRequest.name() + " taken");

        //Assert
        verify(departmentRepository, never()).save(any());
    }


    @Test
    void updateDepartment() {
        //Arrange
        Long id = 1L;
        DepartmentRequest departmentRequest
                = new DepartmentRequest("HR Updated", "Human resources updated");

        Department existingDepartment =
                Department.builder()
                        .id(id)
                        .name("HR")
                        .description("Human resources")
                        .build();

        Department savedDepartment =
                Department.builder()
                        .id(id)
                        .name(departmentRequest.name())
                        .description(departmentRequest.description())
                        .build();

        when(departmentRepository.findById(id))
                .thenReturn(Optional.of(existingDepartment));

        when(departmentRepository.save(any(Department.class)))
                .thenReturn(savedDepartment);

        //Act
        underTest.updateDepartment(id, departmentRequest);

        //Assert
        ArgumentCaptor<Department> captor = ArgumentCaptor.forClass(Department.class);
        verify(departmentRepository).save(captor.capture());
        assertThat(captor.getValue().getName()).isEqualTo("HR Updated");
        assertThat(captor.getValue().getDescription()).isEqualTo("Human resources updated");
    }

    @Test
    void updateDepartmentThrowsWhenNotFound() {
        //Arrange
        Long id = 999L;
        DepartmentRequest departmentRequest
                = new DepartmentRequest("HR", "desc");

        when(departmentRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.updateDepartment(id, departmentRequest))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Department not found with id");

        verify(departmentRepository, never()).save(any());
    }

    @Test
    void deleteDepartment() {
        //Arrange
        Long id = 1L;
        Department department =
                Department.builder()
                        .id(id)
                        .name("Engineering")
                        .description("Software development")
                        .build();

        when(departmentRepository.findById(id))
                .thenReturn(Optional.of(department));

        //Act
        underTest.deleteDepartment(id);

        //Assert
        verify(departmentRepository).delete(department);
    }

    @Test
    void deleteDepartmentThrowsWhenNotFound() {
        //Arrange
        Long id = 999L;

        when(departmentRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.deleteDepartment(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Department not found with id");

        verify(departmentRepository, never()).delete(any());
    }

    @Test
    void createDepartmentThrowsWhenDataIntegrityViolation() {
        //Arrange
        DepartmentRequest departmentRequest
                = new DepartmentRequest("Engineering", "Software development");

        when(departmentRepository.existsByName(departmentRequest.name()))
                .thenReturn(false);

        when(departmentRepository.save(any(Department.class)))
                .thenThrow(new DataIntegrityViolationException("unique constraint"));

        //Act & Assert
        assertThatThrownBy(() -> underTest.createDepartment(departmentRequest))
                .isInstanceOf(ResourceExistsException.class)
                .hasMessageContaining("Department with name");

        verify(departmentRepository).save(any());
    }

    @Test
    void updateDepartmentThrowsWhenDataIntegrityViolation() {
        //Arrange
        Long id = 1L;
        DepartmentRequest departmentRequest
                = new DepartmentRequest("HR Duplicate", "desc");

        Department existingDepartment =
                Department.builder()
                        .id(id)
                        .name("HR")
                        .description("Human resources")
                        .build();

        when(departmentRepository.findById(id))
                .thenReturn(Optional.of(existingDepartment));

        when(departmentRepository.save(any(Department.class)))
                .thenThrow(new DataIntegrityViolationException("unique constraint"));

        //Act & Assert
        assertThatThrownBy(() -> underTest.updateDepartment(id, departmentRequest))
                .isInstanceOf(ResourceExistsException.class)
                .hasMessageContaining("Department with name");

        verify(departmentRepository).save(any());
    }

    @Test
    void deleteDepartmentThrowsWhenDataIntegrityViolation() {
        //Arrange
        Long id = 1L;
        Department department =
                Department.builder()
                        .id(id)
                        .name("Engineering")
                        .description("Software development")
                        .build();

        when(departmentRepository.findById(id))
                .thenReturn(Optional.of(department));

        doThrow(new DataIntegrityViolationException("referential integrity"))
                .when(departmentRepository).delete(department);

        //Act & Assert
        assertThatThrownBy(() -> underTest.deleteDepartment(id))
                .isInstanceOf(ResourceExistsException.class)
                .hasMessageContaining("Department cannot be deleted due to existing references");

        verify(departmentRepository).delete(department);
    }
}