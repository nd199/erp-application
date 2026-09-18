package com.naren.erpbackend.sales.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.sales.dto.SalesOrderResponse;
import com.naren.erpbackend.sales.dto.SalesOrderResponseMapper;
import com.naren.erpbackend.sales.entity.OrderStatus;
import com.naren.erpbackend.sales.entity.SalesOrder;
import com.naren.erpbackend.sales.repository.SalesOrderRepository;
import com.naren.erpbackend.sales.repository.SalesOrderSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalesOrderQServiceImpl implements SalesOrderQService {

    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderResponseMapper responseMapper;

    @Override
    public SalesOrderResponse findSalesOrderById(Long id) {
        log.info("Fetch sales order: id={}", id);

        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales Order Not Found: " + id));

        return responseMapper.apply(salesOrder);
    }

    @Override
    public Page<SalesOrderResponse> findAllSalesOrders(Pageable pageable) {
        log.info("Fetch all sales orders: pageable={}", pageable);

        return salesOrderRepository.findAll(pageable).map(responseMapper);
    }

    @Override
    public Page<SalesOrderResponse> searchSalesOrders(String keyword, Pageable pageable) {
        log.info("Search sales orders: keyword={}", keyword);

        return salesOrderRepository.searchSalesOrders(keyword, pageable).map(responseMapper);
    }

    @Override
    public Page<SalesOrderResponse> filterSalesOrders(String keyword, OrderStatus status, Long userId, Pageable pageable) {
        log.info("Filter sales orders: keyword={}, status={}, userId={}", keyword, status, userId);

        Specification<SalesOrder> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(SalesOrderSpecifications.keywordLike(keyword.trim()));
        }
        if (status != null) {
            spec = spec.and(SalesOrderSpecifications.hasStatus(status));
        }
        if (userId != null) {
            spec = spec.and(SalesOrderSpecifications.belongsToUser(userId));
        }

        return salesOrderRepository.findAll(spec, pageable).map(responseMapper);
    }

    @Override
    public Page<SalesOrderResponse> findSalesOrdersByUser(Long userId, Pageable pageable) {
        log.info("Fetch sales orders by user: userId={}", userId);

        return salesOrderRepository.findByUserId(userId, pageable).map(responseMapper);
    }
}