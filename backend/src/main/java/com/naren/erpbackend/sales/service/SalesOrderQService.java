package com.naren.erpbackend.sales.service;

import com.naren.erpbackend.sales.dto.SalesOrderResponse;
import com.naren.erpbackend.sales.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface SalesOrderQService {

    SalesOrderResponse findSalesOrderById(Long id);

    Page<SalesOrderResponse> findAllSalesOrders(Pageable pageable);

    Page<SalesOrderResponse> searchSalesOrders(String keyword, Pageable pageable);

    Page<SalesOrderResponse> filterSalesOrders(String keyword, OrderStatus status, Long userId, Pageable pageable);

    Page<SalesOrderResponse> findSalesOrdersByUser(Long userId, Pageable pageable);
}