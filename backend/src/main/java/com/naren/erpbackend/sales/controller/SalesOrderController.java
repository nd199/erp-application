package com.naren.erpbackend.sales.controller;

import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.sales.dto.SalesOrderRequest;
import com.naren.erpbackend.sales.dto.SalesOrderResponse;
import com.naren.erpbackend.sales.dto.SalesOrderUpdateRequest;
import com.naren.erpbackend.sales.entity.OrderStatus;
import com.naren.erpbackend.sales.service.SalesOrderMService;
import com.naren.erpbackend.sales.service.SalesOrderQService;
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
@RequestMapping("/api/v1/orders")
public class SalesOrderController {

    private final SalesOrderMService salesOrderMService;
    private final SalesOrderQService salesOrderQService;

    @PostMapping
    @PreAuthorize("hasAuthority('SALES_ORDER_CREATE')")
    public ResponseEntity<SalesOrderResponse> createSalesOrder(@Valid @RequestBody SalesOrderRequest request) {
        log.info("Create sales order: userId={}, items={}", request.userId(), request.items().size());
        SalesOrderResponse response = salesOrderMService.createSalesOrder(request);
        log.info("Sales order created: id={}, total={}", response.id(), response.totalAmount());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SALES_ORDER_READ')")
    public ResponseEntity<SalesOrderResponse> getSalesOrderById(@PathVariable Long id) {
        log.info("Fetch sales order: id={}", id);
        SalesOrderResponse response = salesOrderQService.findSalesOrderById(id);
        log.info("Sales order fetched: id={}, status={}", response.id(), response.status());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('SALES_ORDER_READ')")
    public ResponseEntity<Page<SalesOrderResponse>> getAllSalesOrders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId,
            Pageable pageable) {
        log.info("Fetch sales orders: search={}, status={}, userId={}, page={}, size={}",
                search, status, userId, pageable.getPageNumber(), pageable.getPageSize());
        OrderStatus orderStatus = (status == null || status.isBlank())
                ? null
                : OrderStatus.valueOf(status.trim().toUpperCase());
        return ResponseEntity.ok(salesOrderQService.filterSalesOrders(search, orderStatus, userId, pageable));
    }

    @GetMapping("/my-orders")
    @PreAuthorize("hasAuthority('SALES_ORDER_READ')")
    public ResponseEntity<Page<SalesOrderResponse>> getMyOrders(Pageable pageable) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        log.info("Fetch my sales orders: userId={}, page={}, size={}",
                currentUserId, pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(salesOrderQService.findSalesOrdersByUser(currentUserId, pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('SALES_ORDER_READ')")
    public ResponseEntity<Page<SalesOrderResponse>> searchSalesOrders(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search sales orders: keyword={}", keyword);
        return ResponseEntity.ok(salesOrderQService.searchSalesOrders(keyword, pageable));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('SALES_ORDER_READ')")
    public ResponseEntity<Page<SalesOrderResponse>> getSalesOrdersByUser(
            @PathVariable Long userId, Pageable pageable) {
        log.info("Fetch sales orders by user: userId={}", userId);
        return ResponseEntity.ok(salesOrderQService.findSalesOrdersByUser(userId, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('SALES_ORDER_UPDATE')")
    public ResponseEntity<SalesOrderResponse> updateSalesOrder(
            @PathVariable Long id,
            @Valid @RequestBody SalesOrderUpdateRequest request) {
        log.info("Update sales order: id={}", id);
        SalesOrderResponse response = salesOrderMService.updateSalesOrder(id, request);
        log.info("Sales order updated: id={}, total={}", response.id(), response.totalAmount());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('SALES_ORDER_UPDATE')")
    public ResponseEntity<SalesOrderResponse> updateSalesOrderStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        log.info("Update sales order status: id={}, status={}", id, status);
        OrderStatus orderStatus = OrderStatus.valueOf(status.trim().toUpperCase());
        SalesOrderResponse response = salesOrderMService.updateSalesOrderStatus(id, orderStatus);
        log.info("Sales order status updated: id={}, status={}", response.id(), response.status());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SALES_ORDER_DELETE')")
    public ResponseEntity<Void> deleteSalesOrder(@PathVariable Long id) {
        log.info("Delete sales order: id={}", id);
        salesOrderMService.deleteSalesOrder(id);
        log.info("Sales order deleted: id={}", id);
        return ResponseEntity.noContent().build();
    }
}