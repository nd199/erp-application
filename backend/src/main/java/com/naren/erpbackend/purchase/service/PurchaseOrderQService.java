package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.purchase.dto.PurchaseOrderResponse;
import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface PurchaseOrderQService {

    PurchaseOrderResponse findPurchaseOrderById(Long id);

    Page<PurchaseOrderResponse> findAllPurchaseOrders(Pageable pageable);

    Page<PurchaseOrderResponse> searchPurchaseOrders(String keyword, Pageable pageable);

    Page<PurchaseOrderResponse> filterPurchaseOrders(String keyword, PurchaseOrderStatus status, Long supplierId, Long userId, Pageable pageable);

    Page<PurchaseOrderResponse> findPurchaseOrdersByUser(Long userId, Pageable pageable);
}
