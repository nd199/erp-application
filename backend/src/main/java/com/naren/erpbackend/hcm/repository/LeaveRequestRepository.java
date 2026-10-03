package com.naren.erpbackend.hcm.repository;

import com.naren.erpbackend.hcm.entity.LeaveRequest;
import com.naren.erpbackend.hcm.entity.LeaveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long>, JpaSpecificationExecutor<LeaveRequest> {

    @Query("SELECT l FROM LeaveRequest l WHERE l.deleted = false")
    Page<LeaveRequest> findAllNonDeleted(Pageable pageable);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.id = :employeeId AND l.deleted = false")
    Page<LeaveRequest> findByEmployeeId(@Param("employeeId") Long employeeId, Pageable pageable);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = :status AND l.deleted = false")
    Page<LeaveRequest> findByStatus(@Param("status") LeaveStatus status, Pageable pageable);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.id = :employeeId AND l.deleted = false AND " +
            "(l.fromDate <= :toDate AND l.toDate >= :fromDate) AND l.status IN ('PENDING', 'APPROVED')")
    long countOverlapping(@Param("employeeId") Long employeeId,
                          @Param("fromDate") java.time.LocalDate fromDate,
                          @Param("toDate") java.time.LocalDate toDate);

    @Query("SELECT l FROM LeaveRequest l WHERE l.deleted = false AND " +
            "(LOWER(l.reason) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.employee.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.employee.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.employee.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<LeaveRequest> searchLeaves(@Param("keyword") String keyword, Pageable pageable);
}
