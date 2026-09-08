package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import com.naren.erpbackend.employee.dto.EmployeeResponseMapper;
import com.naren.erpbackend.employee.entity.Department;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.user.entity.UserStatus;
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
class EmployeeQServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EmployeeResponseMapper employeeResponseMapper;

    private EmployeeQServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new EmployeeQServiceImpl(
                employeeRepository, employeeResponseMapper
        );
    }

    private Department createDepartment(Long id, String name) {
        return Department.builder()
                .id(id)
                .name(name)
                .description("Department description")
                .build();
    }

    private Employee createEmployee(Long id, String firstName, String lastName, boolean deleted) {
        return Employee.builder()
                .id(id)
                .firstName(firstName)
                .lastName(lastName)
                .email(firstName.toLowerCase() + "@example.com")
                .phone("+1234567890")
                .jobTitle("Engineer")
                .department(createDepartment(1L, "Engineering"))
                .status(UserStatus.ACTIVE)
                .deleted(deleted)
                .build();
    }

    private EmployeeResponse createEmployeeResponse(Long id, String firstName, String lastName) {
        return new EmployeeResponse(
                id, firstName, lastName,
                firstName.toLowerCase() + "@example.com", "+1234567890",
                null, "Engineer",
                1L, "Engineering", null, UserStatus.ACTIVE,
                null, null
        );
    }

    @Test
    void findEmployeeById() {
        //Arrange
        Long id = 1L;
        Employee employee = createEmployee(id, "John", "Doe", false);
        EmployeeResponse response = createEmployeeResponse(id, "John", "Doe");

        when(employeeRepository.findById(id))
                .thenReturn(Optional.of(employee));
        when(employeeResponseMapper.apply(employee))
                .thenReturn(response);

        //Act
        EmployeeResponse result = underTest.findEmployeeById(id);

        //Assert
        assertThat(result).isEqualTo(response);
        assertThat(result.firstName()).isEqualTo("John");
    }

    @Test
    void findEmployeeByIdThrowsWhenNotFound() {
        //Arrange
        Long id = 999L;

        when(employeeRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.findEmployeeById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee not found with id");
    }

    @Test
    void findEmployeeByIdThrowsWhenDeleted() {
        //Arrange
        Long id = 1L;
        Employee deletedEmployee = createEmployee(id, "John", "Doe", true);

        when(employeeRepository.findById(id))
                .thenReturn(Optional.of(deletedEmployee));

        //Act & Assert
        assertThatThrownBy(() -> underTest.findEmployeeById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee not found with id");
    }

    @Test
    void findEmployeeByEmail() {
        //Arrange
        String email = "john@example.com";
        Employee employee = createEmployee(1L, "John", "Doe", false);
        EmployeeResponse response = createEmployeeResponse(1L, "John", "Doe");

        when(employeeRepository.findByEmailAndDeletedFalse(email))
                .thenReturn(Optional.of(employee));
        when(employeeResponseMapper.apply(employee))
                .thenReturn(response);

        //Act
        EmployeeResponse result = underTest.findEmployeeByEmail(email);

        //Assert
        assertThat(result).isEqualTo(response);
    }

    @Test
    void findEmployeeByEmailThrowsWhenNotFound() {
        //Arrange
        String email = "nonexistent@example.com";

        when(employeeRepository.findByEmailAndDeletedFalse(email))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.findEmployeeByEmail(email))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee not found with email");
    }

    @Test
    void findAllEmployees() {
        //Arrange
        Pageable pageable = PageRequest.of(0, 10);

        Employee employee1 = createEmployee(1L, "John", "Doe", false);
        Employee employee2 = createEmployee(2L, "Jane", "Smith", false);

        EmployeeResponse response1 = createEmployeeResponse(1L, "John", "Doe");
        EmployeeResponse response2 = createEmployeeResponse(2L, "Jane", "Smith");

        Page<Employee> employeePage = new PageImpl<>(
                List.of(employee1, employee2), pageable, 2
        );

        Page<EmployeeResponse> responsePage = new PageImpl<>(
                List.of(response1, response2), pageable, 2
        );

        when(employeeRepository.findAllNonDeleted(pageable))
                .thenReturn(employeePage);
        when(employeeResponseMapper.apply(employee1))
                .thenReturn(response1);
        when(employeeResponseMapper.apply(employee2))
                .thenReturn(response2);

        //Act
        Page<EmployeeResponse> result = underTest.findAllEmployees(pageable);

        //Assert
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).firstName()).isEqualTo("John");
        assertThat(result.getContent().get(1).firstName()).isEqualTo("Jane");
        assertThat(result.getTotalElements()).isEqualTo(2);
    }

    @Test
    void searchEmployees() {
        //Arrange
        String keyword = "John";
        Pageable pageable = PageRequest.of(0, 10);

        Employee employee = createEmployee(1L, "John", "Doe", false);
        EmployeeResponse response = createEmployeeResponse(1L, "John", "Doe");

        Page<Employee> employeePage = new PageImpl<>(
                List.of(employee), pageable, 1
        );

        Page<EmployeeResponse> responsePage = new PageImpl<>(
                List.of(response), pageable, 1
        );

        when(employeeRepository.searchEmployees(keyword, pageable))
                .thenReturn(employeePage);
        when(employeeResponseMapper.apply(employee))
                .thenReturn(response);

        //Act
        Page<EmployeeResponse> result = underTest.searchEmployees(keyword, pageable);

        //Assert
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).firstName()).isEqualTo("John");
    }

    @Test
    void searchEmployeesReturnsEmptyWhenNoMatch() {
        //Arrange
        String keyword = "nonexistent";
        Pageable pageable = PageRequest.of(0, 10);

        Page<Employee> emptyPage = new PageImpl<>(
                List.of(), pageable, 0
        );

        when(employeeRepository.searchEmployees(keyword, pageable))
                .thenReturn(emptyPage);

        //Act
        Page<EmployeeResponse> result = underTest.searchEmployees(keyword, pageable);

        //Assert
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
    }

    @Test
    void findEmployeesByDepartment() {
        //Arrange
        Long departmentId = 1L;
        Pageable pageable = PageRequest.of(0, 10);

        Employee employee1 = createEmployee(1L, "John", "Doe", false);
        Employee employee2 = createEmployee(2L, "Jane", "Smith", false);

        EmployeeResponse response1 = createEmployeeResponse(1L, "John", "Doe");
        EmployeeResponse response2 = createEmployeeResponse(2L, "Jane", "Smith");

        Page<Employee> employeePage = new PageImpl<>(
                List.of(employee1, employee2), pageable, 2
        );

        Page<EmployeeResponse> responsePage = new PageImpl<>(
                List.of(response1, response2), pageable, 2
        );

        when(employeeRepository.findByDepartmentId(departmentId, pageable))
                .thenReturn(employeePage);
        when(employeeResponseMapper.apply(employee1))
                .thenReturn(response1);
        when(employeeResponseMapper.apply(employee2))
                .thenReturn(response2);

        //Act
        Page<EmployeeResponse> result = underTest.findEmployeesByDepartment(departmentId, pageable);

        //Assert
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getContent().get(0).departmentId()).isEqualTo(1L);
        assertThat(result.getContent().get(1).departmentId()).isEqualTo(1L);
    }

    @Test
    void findEmployeesByDepartmentReturnsEmptyWhenNone() {
        //Arrange
        Long departmentId = 999L;
        Pageable pageable = PageRequest.of(0, 10);

        Page<Employee> emptyPage = new PageImpl<>(
                List.of(), pageable, 0
        );

        when(employeeRepository.findByDepartmentId(departmentId, pageable))
                .thenReturn(emptyPage);

        //Act
        Page<EmployeeResponse> result = underTest.findEmployeesByDepartment(departmentId, pageable);

        //Assert
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
    }
}
