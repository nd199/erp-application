package com.naren.erpbackend.hcm.repository;

import com.naren.erpbackend.hcm.entity.LeaveBalance;
import com.naren.erpbackend.hcm.entity.LeaveType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {

    boolean existsByEmployeeIdAndYearAndLeaveType(Long employeeId, Integer year, LeaveType leaveType);

    Page<LeaveBalance> findByEmployeeId(Long employeeId, Pageable pageable);

    Page<LeaveBalance> findByYear(Integer year, Pageable pageable);

    Page<LeaveBalance> findByEmployeeIdAndYear(Long employeeId, Integer year, Pageable pageable);

    @Query("SELECT COALESCE(SUM(lr.days), 0) FROM LeaveRequest lr " +
            "WHERE lr.employee.id = :employeeId " +
            "AND lr.leaveType = :leaveType " +
            "AND FUNCTION('YEAR', lr.fromDate) = :year " +
            "AND lr.status = com.naren.erpbackend.hcm.entity.LeaveStatus.APPROVED " +
            "AND lr.deleted = false")
    BigDecimal sumApprovedLeaveDays(@Param("employeeId") Long employeeId,
                                    @Param("leaveType") LeaveType leaveType,
                                    @Param("year") Integer year);
}
