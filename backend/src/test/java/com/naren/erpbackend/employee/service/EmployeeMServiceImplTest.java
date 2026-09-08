package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.employee.dto.EmployeeRequest;
import com.naren.erpbackend.employee.dto.EmployeeResponse;
import com.naren.erpbackend.employee.dto.EmployeeResponseMapper;
import com.naren.erpbackend.employee.entity.Department;
import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.employee.repository.DepartmentRepository;
import com.naren.erpbackend.employee.repository.EmployeeRepository;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeMServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private EmployeeResponseMapper employeeResponseMapper;

    private EmployeeMServiceImpl underTest;

    @BeforeEach
    void setUp() {
        underTest = new EmployeeMServiceImpl(
                employeeRepository,
                departmentRepository,
                userProfileRepository,
                employeeResponseMapper
        );
    }

    private Department createDepartment(Long id, String name) {
        return Department.builder()
                .id(id)
                .name(name)
                .description("Department description")
                .build();
    }

    private UserProfile createUserProfile(Long id) {
        return UserProfile.builder()
                .id(id)
                .username("johndoe")
                .email("john@example.com")
                .password("password")
                .phone("1234567890")
                .address("123 Main St")
                .build();
    }

    private EmployeeRequest createEmployeeRequest() {
        return new EmployeeRequest(
                "John",
                "Doe",
                "john@example.com",
                "+1234567890",
                LocalDate.of(2024, 1, 15),
                "Software Engineer",
                1L,
                null
        );
    }

    @Test
    void createEmployee() {
        //Arrange
        EmployeeRequest request = createEmployeeRequest();
        Department department = createDepartment(1L, "Engineering");

        Employee employee = Employee.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .phone("+1234567890")
                .hireDate(LocalDate.of(2024, 1, 15))
                .jobTitle("Software Engineer")
                .department(department)
                .status(UserStatus.ACTIVE)
                .build();

        EmployeeResponse response = new EmployeeResponse(
                1L, "John", "Doe", "john@example.com", "+1234567890",
                LocalDate.of(2024, 1, 15), "Software Engineer",
                1L, "Engineering", null, UserStatus.ACTIVE,
                null, null
        );

        when(employeeRepository.existsByEmailAndDeletedFalse("john@example.com"))
                .thenReturn(false);
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));
        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(employee);
        when(employeeResponseMapper.apply(any(Employee.class)))
                .thenReturn(response);

        //Act
        underTest.createEmployee(request);

        //Assert
        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().getFirstName()).isEqualTo("John");
        assertThat(captor.getValue().getLastName()).isEqualTo("Doe");
        assertThat(captor.getValue().getEmail()).isEqualTo("john@example.com");
    }

    @Test
    void createEmployeeTrimsAndLowercasesFields() {
        //Arrange
        EmployeeRequest request = new EmployeeRequest(
                "  John  ",
                "  Doe  ",
                "  John@Example.com  ",
                "  +1234567890  ",
                LocalDate.of(2024, 1, 15),
                "  Software Engineer  ",
                1L,
                null
        );

        Department department = createDepartment(1L, "Engineering");

        Employee employee = Employee.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .phone("+1234567890")
                .hireDate(LocalDate.of(2024, 1, 15))
                .jobTitle("Software Engineer")
                .department(department)
                .status(UserStatus.ACTIVE)
                .build();

        EmployeeResponse response = new EmployeeResponse(
                1L, "John", "Doe", "john@example.com", "+1234567890",
                LocalDate.of(2024, 1, 15), "Software Engineer",
                1L, "Engineering", null, UserStatus.ACTIVE,
                null, null
        );

        when(employeeRepository.existsByEmailAndDeletedFalse("john@example.com"))
                .thenReturn(false);
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));
        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(employee);
        when(employeeResponseMapper.apply(any(Employee.class)))
                .thenReturn(response);

        //Act
        underTest.createEmployee(request);

        //Assert
        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().getFirstName()).isEqualTo("John");
        assertThat(captor.getValue().getLastName()).isEqualTo("Doe");
        assertThat(captor.getValue().getEmail()).isEqualTo("john@example.com");
        assertThat(captor.getValue().getPhone()).isEqualTo("+1234567890");
        assertThat(captor.getValue().getJobTitle()).isEqualTo("Software Engineer");
    }

    @Test
    void createEmployeeSetsUserProfileWhenProvided() {
        //Arrange
        EmployeeRequest request = new EmployeeRequest(
                "John", "Doe", "john@example.com", "+1234567890",
                LocalDate.of(2024, 1, 15), "Software Engineer",
                1L, 10L
        );

        Department department = createDepartment(1L, "Engineering");
        UserProfile userProfile = createUserProfile(10L);

        Employee employee = Employee.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .phone("+1234567890")
                .hireDate(LocalDate.of(2024, 1, 15))
                .jobTitle("Software Engineer")
                .department(department)
                .userProfile(userProfile)
                .status(UserStatus.ACTIVE)
                .build();

        EmployeeResponse response = new EmployeeResponse(
                1L, "John", "Doe", "john@example.com", "+1234567890",
                LocalDate.of(2024, 1, 15), "Software Engineer",
                1L, "Engineering", 10L, UserStatus.ACTIVE,
                null, null
        );

        when(employeeRepository.existsByEmailAndDeletedFalse("john@example.com"))
                .thenReturn(false);
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));
        when(userProfileRepository.findById(10L))
                .thenReturn(Optional.of(userProfile));
        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(employee);
        when(employeeResponseMapper.apply(any(Employee.class)))
                .thenReturn(response);

        //Act
        underTest.createEmployee(request);

        //Assert
        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().getUserProfile()).isEqualTo(userProfile);
    }

    @Test
    void createEmployeeThrowsWhenEmailExists() {
        //Arrange
        EmployeeRequest request = createEmployeeRequest();

        when(employeeRepository.existsByEmailAndDeletedFalse("john@example.com"))
                .thenReturn(true);

        //Act & Assert
        assertThatThrownBy(() -> underTest.createEmployee(request))
                .isInstanceOf(ResourceExistsException.class)
                .hasMessageContaining("Employee already exists with email");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void createEmployeeThrowsWhenDepartmentNotFound() {
        //Arrange
        EmployeeRequest request = createEmployeeRequest();

        when(employeeRepository.existsByEmailAndDeletedFalse("john@example.com"))
                .thenReturn(false);
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.createEmployee(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Department not found with id");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void createEmployeeThrowsWhenUserProfileNotFound() {
        //Arrange
        EmployeeRequest request = new EmployeeRequest(
                "John", "Doe", "john@example.com", "+1234567890",
                LocalDate.of(2024, 1, 15), "Software Engineer",
                1L, 999L
        );

        Department department = createDepartment(1L, "Engineering");

        when(employeeRepository.existsByEmailAndDeletedFalse("john@example.com"))
                .thenReturn(false);
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));
        when(userProfileRepository.findById(999L))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.createEmployee(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found with id");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void createEmployeeThrowsWhenDataIntegrityViolation() {
        //Arrange
        EmployeeRequest request = createEmployeeRequest();
        Department department = createDepartment(1L, "Engineering");

        when(employeeRepository.existsByEmailAndDeletedFalse("john@example.com"))
                .thenReturn(false);
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));
        when(employeeRepository.save(any(Employee.class)))
                .thenThrow(new DataIntegrityViolationException("unique constraint"));

        //Act & Assert
        assertThatThrownBy(() -> underTest.createEmployee(request))
                .isInstanceOf(ResourceExistsException.class)
                .hasMessageContaining("Employee already exists with email");

        verify(employeeRepository).save(any());
    }

    @Test
    void updateEmployee() {
        //Arrange
        Long id = 1L;
        EmployeeRequest request = new EmployeeRequest(
                "Jane", "Smith", "jane@example.com", "+0987654321",
                LocalDate.of(2023, 6, 1), "Senior Engineer",
                2L, null
        );

        Department department = createDepartment(2L, "Platform");

        Employee existingEmployee = Employee.builder()
                .id(id)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .phone("+1234567890")
                .hireDate(LocalDate.of(2024, 1, 15))
                .jobTitle("Software Engineer")
                .department(createDepartment(1L, "Engineering"))
                .status(UserStatus.ACTIVE)
                .build();

        Employee savedEmployee = Employee.builder()
                .id(id)
                .firstName("Jane")
                .lastName("Smith")
                .email("jane@example.com")
                .phone("+0987654321")
                .hireDate(LocalDate.of(2023, 6, 1))
                .jobTitle("Senior Engineer")
                .department(department)
                .status(UserStatus.ACTIVE)
                .build();

        EmployeeResponse response = new EmployeeResponse(
                1L, "Jane", "Smith", "jane@example.com", "+0987654321",
                LocalDate.of(2023, 6, 1), "Senior Engineer",
                2L, "Platform", null, UserStatus.ACTIVE,
                null, null
        );

        when(employeeRepository.findById(id))
                .thenReturn(Optional.of(existingEmployee));
        when(departmentRepository.findById(2L))
                .thenReturn(Optional.of(department));
        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(savedEmployee);
        when(employeeResponseMapper.apply(any(Employee.class)))
                .thenReturn(response);

        //Act
        underTest.updateEmployee(id, request);

        //Assert
        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().getFirstName()).isEqualTo("Jane");
        assertThat(captor.getValue().getLastName()).isEqualTo("Smith");
        assertThat(captor.getValue().getEmail()).isEqualTo("jane@example.com");
        assertThat(captor.getValue().getDepartment()).isEqualTo(department);
    }

    @Test
    void updateEmployeeThrowsWhenNotFound() {
        //Arrange
        Long id = 999L;
        EmployeeRequest request = createEmployeeRequest();

        when(employeeRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.updateEmployee(id, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee not found with id");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void updateEmployeeThrowsWhenDepartmentNotFound() {
        //Arrange
        Long id = 1L;
        EmployeeRequest request = createEmployeeRequest();

        Employee existingEmployee = Employee.builder()
                .id(id)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .department(createDepartment(1L, "Engineering"))
                .build();

        when(employeeRepository.findById(id))
                .thenReturn(Optional.of(existingEmployee));
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.updateEmployee(id, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Department not found with id");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void updateEmployeeThrowsWhenUserProfileNotFound() {
        //Arrange
        Long id = 1L;
        EmployeeRequest request = new EmployeeRequest(
                "John", "Doe", "john@example.com", "+1234567890",
                LocalDate.of(2024, 1, 15), "Software Engineer",
                1L, 999L
        );

        Department department = createDepartment(1L, "Engineering");

        Employee existingEmployee = Employee.builder()
                .id(id)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .department(department)
                .build();

        when(employeeRepository.findById(id))
                .thenReturn(Optional.of(existingEmployee));
        when(departmentRepository.findById(1L))
                .thenReturn(Optional.of(department));
        when(userProfileRepository.findById(999L))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.updateEmployee(id, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found with id");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    void deleteEmployee() {
        //Arrange
        Long id = 1L;
        Employee employee = Employee.builder()
                .id(id)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .status(UserStatus.ACTIVE)
                .deleted(false)
                .build();

        when(employeeRepository.findById(id))
                .thenReturn(Optional.of(employee));

        //Act
        underTest.deleteEmployee(id);

        //Assert
        ArgumentCaptor<Employee> captor = ArgumentCaptor.forClass(Employee.class);
        verify(employeeRepository).save(captor.capture());
        assertThat(captor.getValue().isDeleted()).isTrue();
        assertThat(captor.getValue().getStatus()).isEqualTo(UserStatus.INACTIVE);
    }

    @Test
    void deleteEmployeeThrowsWhenNotFound() {
        //Arrange
        Long id = 999L;

        when(employeeRepository.findById(id))
                .thenReturn(Optional.empty());

        //Act & Assert
        assertThatThrownBy(() -> underTest.deleteEmployee(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee not found with id");

        verify(employeeRepository, never()).save(any());
    }
}
