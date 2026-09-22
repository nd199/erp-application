package com.naren.erpbackend.purchase.controller;

import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.purchase.dto.PurchaseOrderRequest;
import com.naren.erpbackend.purchase.dto.PurchaseOrderResponse;
import com.naren.erpbackend.purchase.dto.PurchaseOrderUpdateRequest;
import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;
import com.naren.erpbackend.purchase.service.PurchaseOrderMService;
import com.naren.erpbackend.purchase.service.PurchaseOrderQService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderMService purchaseOrderMService;
    private final PurchaseOrderQService purchaseOrderQService;

    @PostMapping
    @PreAuthorize("hasAuthority('PURCHASE_CREATE')")
    public ResponseEntity<PurchaseOrderResponse> createPurchaseOrder(@Valid @RequestBody PurchaseOrderRequest request) {
        log.info("Create purchase order: supplierId={}, userId={}, items={}", request.supplierId(), request.userId(), request.items().size());
        PurchaseOrderResponse response = purchaseOrderMService.createPurchaseOrder(request);
        log.info("Purchase order created: id={}, total={}", response.id(), response.totalAmount());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PURCHASE_READ')")
    public ResponseEntity<PurchaseOrderResponse> getPurchaseOrderById(@PathVariable Long id) {
        log.info("Fetch purchase order: id={}", id);
        return ResponseEntity.ok(purchaseOrderQService.findPurchaseOrderById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PURCHASE_READ')")
    public ResponseEntity<Page<PurchaseOrderResponse>> getAllPurchaseOrders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Long userId,
            Pageable pageable) {
        log.info("Fetch purchase orders: search={}, status={}, supplierId={}, userId={}, page={}, size={}",
                search, status, supplierId, userId, pageable.getPageNumber(), pageable.getPageSize());
        PurchaseOrderStatus orderStatus = (status == null || status.isBlank())
                ? null
                : PurchaseOrderStatus.valueOf(status.trim().toUpperCase());
        return ResponseEntity.ok(purchaseOrderQService.filterPurchaseOrders(search, orderStatus, supplierId, userId, pageable));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAuthority('PURCHASE_READ')")
    public ResponseEntity<Page<PurchaseOrderResponse>> getMyOrders(Pageable pageable) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        log.info("Fetch my purchase orders: userId={}, page={}, size={}",
                currentUserId, pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(purchaseOrderQService.findPurchaseOrdersByUser(currentUserId, pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PURCHASE_READ')")
    public ResponseEntity<Page<PurchaseOrderResponse>> searchPurchaseOrders(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search purchase orders: keyword={}", keyword);
        return ResponseEntity.ok(purchaseOrderQService.searchPurchaseOrders(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('PURCHASE_UPDATE')")
    public ResponseEntity<PurchaseOrderResponse> updatePurchaseOrder(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseOrderUpdateRequest request) {
        log.info("Update purchase order: id={}", id);
        PurchaseOrderResponse response = purchaseOrderMService.updatePurchaseOrder(id, request);
        log.info("Purchase order updated: id={}, total={}", response.id(), response.totalAmount());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('PURCHASE_UPDATE')")
    public ResponseEntity<PurchaseOrderResponse> updatePurchaseOrderStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        log.info("Update purchase order status: id={}, status={}", id, status);
        PurchaseOrderStatus orderStatus = PurchaseOrderStatus.valueOf(status.trim().toUpperCase());
        PurchaseOrderResponse response = purchaseOrderMService.updatePurchaseOrderStatus(id, orderStatus);
        log.info("Purchase order status updated: id={}, status={}", response.id(), response.status());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PURCHASE_DELETE')")
    public ResponseEntity<Void> deletePurchaseOrder(@PathVariable Long id) {
        log.info("Delete purchase order: id={}", id);
        purchaseOrderMService.deletePurchaseOrder(id);
        log.info("Purchase order deleted: id={}", id);
        return ResponseEntity.noContent().build();
    }
}
