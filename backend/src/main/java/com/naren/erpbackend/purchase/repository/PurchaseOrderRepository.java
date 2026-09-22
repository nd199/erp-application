package com.naren.erpbackend.purchase.repository;

import com.naren.erpbackend.purchase.entity.PurchaseOrder;
import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long>, JpaSpecificationExecutor<PurchaseOrder> {

    @Query("SELECT o FROM PurchaseOrder o WHERE o.user.id = :userId")
    Page<PurchaseOrder> findByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT o FROM PurchaseOrder o WHERE o.status = :status")
    Page<PurchaseOrder> findByStatus(@Param("status") PurchaseOrderStatus status, Pageable pageable);

    @Query("SELECT o FROM PurchaseOrder o WHERE " +
            "LOWER(o.notes) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(CAST(o.status AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(o.supplier.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<PurchaseOrder> searchPurchaseOrders(@Param("keyword") String keyword, Pageable pageable);
}
