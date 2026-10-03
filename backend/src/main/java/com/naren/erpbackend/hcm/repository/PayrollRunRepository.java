package com.naren.erpbackend.hcm.repository;

import com.naren.erpbackend.hcm.entity.PayrollRun;
import com.naren.erpbackend.hcm.entity.PayrollStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PayrollRunRepository extends JpaRepository<PayrollRun, Long>, JpaSpecificationExecutor<PayrollRun> {

    Optional<PayrollRun> findByPeriodMonthAndPeriodYearAndDeletedFalse(Integer periodMonth, Integer periodYear);

    @Query("SELECT p FROM PayrollRun p WHERE p.deleted = false")
    Page<PayrollRun> findAllNonDeleted(Pageable pageable);

    @Query("SELECT p FROM PayrollRun p WHERE p.status = :status AND p.deleted = false")
    Page<PayrollRun> findByStatus(@Param("status") PayrollStatus status, Pageable pageable);

    @Query("SELECT p FROM PayrollRun p WHERE p.periodYear = :year AND p.deleted = false")
    Page<PayrollRun> findByYear(@Param("year") Integer year, Pageable pageable);

    @Query("SELECT p FROM PayrollRun p WHERE p.deleted = false AND " +
            "(LOWER(p.notes) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "p.periodYear = :yearParam)")
    Page<PayrollRun> searchPayrollRuns(@Param("keyword") String keyword,
                                       @Param("yearParam") Integer yearParam,
                                       Pageable pageable);
}
