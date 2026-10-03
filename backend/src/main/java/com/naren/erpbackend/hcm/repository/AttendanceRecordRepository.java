package com.naren.erpbackend.hcm.repository;

import com.naren.erpbackend.hcm.entity.AttendanceRecord;
import com.naren.erpbackend.hcm.entity.AttendanceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long>, JpaSpecificationExecutor<AttendanceRecord> {

    Optional<AttendanceRecord> findByEmployeeIdAndWorkDateAndDeletedFalse(Long employeeId, LocalDate workDate);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.deleted = false")
    Page<AttendanceRecord> findAllNonDeleted(Pageable pageable);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.deleted = false")
    List<AttendanceRecord> findAllNonDeleted();

    @Query("SELECT a FROM AttendanceRecord a WHERE a.employee.id = :employeeId AND a.deleted = false")
    Page<AttendanceRecord> findByEmployeeId(@Param("employeeId") Long employeeId, Pageable pageable);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.employee.id = :employeeId AND a.deleted = false")
    List<AttendanceRecord> findAllByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.workDate = :workDate AND a.deleted = false")
    Page<AttendanceRecord> findByWorkDate(@Param("workDate") LocalDate workDate, Pageable pageable);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.status = :status AND a.deleted = false")
    Page<AttendanceRecord> findByStatus(@Param("status") AttendanceStatus status, Pageable pageable);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.employee.id = :employeeId AND a.deleted = false AND " +
            "a.workDate BETWEEN :fromDate AND :toDate")
    Page<AttendanceRecord> findByEmployeeAndDateRange(@Param("employeeId") Long employeeId,
                                                      @Param("fromDate") LocalDate fromDate,
                                                      @Param("toDate") LocalDate toDate,
                                                      Pageable pageable);

    @Query("SELECT a FROM AttendanceRecord a WHERE a.deleted = false AND " +
            "(LOWER(a.employee.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.employee.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.employee.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<AttendanceRecord> searchAttendance(@Param("keyword") String keyword, Pageable pageable);
}
