package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.purchase.dto.PurchaseOrderRequest;
import com.naren.erpbackend.purchase.dto.PurchaseOrderResponse;
import com.naren.erpbackend.purchase.dto.PurchaseOrderUpdateRequest;
import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface PurchaseOrderMService {

    PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request);

    PurchaseOrderResponse updatePurchaseOrder(Long id, PurchaseOrderUpdateRequest request);

    PurchaseOrderResponse updatePurchaseOrderStatus(Long id, PurchaseOrderStatus status);

    void deletePurchaseOrder(Long id);
}
