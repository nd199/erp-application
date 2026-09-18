package com.naren.erpbackend.sales.service;

import com.naren.erpbackend.sales.dto.SalesOrderRequest;
import com.naren.erpbackend.sales.dto.SalesOrderResponse;
import com.naren.erpbackend.sales.dto.SalesOrderUpdateRequest;
import com.naren.erpbackend.sales.entity.OrderStatus;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface SalesOrderMService {

    SalesOrderResponse createSalesOrder(SalesOrderRequest request);

    SalesOrderResponse updateSalesOrder(Long id, SalesOrderUpdateRequest request);

    SalesOrderResponse updateSalesOrderStatus(Long id, OrderStatus status);

    void deleteSalesOrder(Long id);
}