package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.DepartmentResponse;
import com.naren.erpbackend.employee.dto.DepartmentResponseMapper;
import com.naren.erpbackend.employee.entity.Department;
import com.naren.erpbackend.employee.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepartmentQServiceImplTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private DepartmentResponseMapper responseMapper;

    private DepartmentQServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new DepartmentQServiceImpl(
                departmentRepository, responseMapper
        );
    }

    private Department createDepartment(Long id, String name, String description) {
        return Department.builder()
                .id(id)
                .name(name)
                .description(description)
                .build();
    }

    private DepartmentResponse createDepartmentResponse(Long id, String name, String description) {
        return new DepartmentResponse(id, name, description, null, null);
    }

    @Test
    void findDepartmentById() {
        //Arrange
        Long id = 1L;
        Department department = createDepartment(id, "Engineering", "Software development");
        DepartmentResponse response = createDepartmentResponse(id, "Engineering", "Software development");

        when(departmentRepository.findById(id))
                .thenReturn(Optional.of(department));
        when(responseMapper.apply(department))
                .thenReturn(response);

        //Act
        DepartmentResponse result = underTest.findDepartmentById(id);

        //Assert
        assertThat(result).isEqualTo(response);
        assertThat(result.name()).isEqualTo("Engineering");
    }

    @Test
    void findDepartmentByIdThrowsWhenNotFound() {
        //Arrange
        Long id = 999L;

        when(departmentRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.findDepartmentById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Department not found with id");
    }

    @Test
    void findAllDepartments() {
        //Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Department dept1 = createDepartment(1L, "Engineering", "Software development");
        Department dept2 = createDepartment(2L, "Human Resources", "People operations");

        DepartmentResponse response1 = createDepartmentResponse(1L, "Engineering", "Software development");
        DepartmentResponse response2 = createDepartmentResponse(2L, "Human Resources", "People operations");

        Page<Department> departmentPage = new PageImpl<>(
                List.of(dept1, dept2), pageable, 2
        );

        when(departmentRepository.findAll(pageable))
                .thenReturn(departmentPage);
        when(responseMapper.apply(dept1))
                .thenReturn(response1);
        when(responseMapper.apply(dept2))
                .thenReturn(response2);

        //Act
        Page<DepartmentResponse> result = underTest.findAllDepartments(pageable);

        //Assert
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).name()).isEqualTo("Engineering");
        assertThat(result.getContent().get(1).name()).isEqualTo("Human Resources");
        assertThat(result.getTotalElements()).isEqualTo(2);
    }

    @Test
    void findAllDepartmentsReturnsEmptyWhenNone() {
        //Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Page<Department> emptyPage = new PageImpl<>(
                List.of(), pageable, 0
        );

        when(departmentRepository.findAll(pageable))
                .thenReturn(emptyPage);

        //Act
        Page<DepartmentResponse> result = underTest.findAllDepartments(pageable);

        //Assert
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
    }

    @Test
    void searchDepartments() {
        //Arrange
        String keyword = "Engineering";
        Pageable pageable = PageRequest.of(0, 10);

        Department dept = createDepartment(1L, "Engineering", "Software development");
        DepartmentResponse response = createDepartmentResponse(1L, "Engineering", "Software development");

        Page<Department> departmentPage = new PageImpl<>(
                List.of(dept), pageable, 1
        );

        when(departmentRepository.searchDepartments(keyword, pageable))
                .thenReturn(departmentPage);
        when(responseMapper.apply(dept))
                .thenReturn(response);

        //Act
        Page<DepartmentResponse> result = underTest.searchDepartments(keyword, pageable);

        //Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).name()).isEqualTo("Engineering");
    }

    @Test
    void searchDepartmentsReturnsEmptyWhenNoMatch() {
        //Arrange
        String keyword = "nonexistent";
        Pageable pageable = PageRequest.of(0, 10);

        Page<Department> emptyPage = new PageImpl<>(
                List.of(), pageable, 0
        );

        when(departmentRepository.searchDepartments(keyword, pageable))
                .thenReturn(emptyPage);

        //Act
        Page<DepartmentResponse> result = underTest.searchDepartments(keyword, pageable);

        //Assert
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
    }
}
