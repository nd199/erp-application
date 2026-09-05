package com.naren.erpbackend.employee.repository;

import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.user.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmailAndDeletedFalse(String email);

    Optional<Employee> findByEmailAndDeletedFalse(String email);

    Optional<Employee> findByUserProfileId(Long userProfileId);

    @Query("SELECT e FROM Employee e WHERE e.deleted = false")
    Page<Employee> findAllNonDeleted(Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.status = :status AND e.deleted = false")
    Page<Employee> findAllByStatus(@Param("status") UserStatus status, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId AND e.deleted = false")
    Page<Employee> findByDepartmentId(@Param("departmentId") Long departmentId, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.deleted = false AND " +
            "(LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Employee> searchEmployees(@Param("keyword") String keyword, Pageable pageable);
}
