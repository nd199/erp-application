package com.naren.erpbackend.sales.repository;

import com.naren.erpbackend.sales.entity.OrderStatus;
import com.naren.erpbackend.sales.entity.SalesOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long>, JpaSpecificationExecutor<SalesOrder> {

    @Query("SELECT o FROM SalesOrder o WHERE o.user.id = :userId")
    Page<SalesOrder> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT o FROM SalesOrder o WHERE o.status = :status")
    Page<SalesOrder> findByStatus(@Param("status") OrderStatus status, Pageable pageable);

    @Query("SELECT o FROM SalesOrder o WHERE " +
            "LOWER(o.notes) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(o.status AS string)) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<SalesOrder> searchSalesOrders(@Param("keyword") String keyword, Pageable pageable);
}