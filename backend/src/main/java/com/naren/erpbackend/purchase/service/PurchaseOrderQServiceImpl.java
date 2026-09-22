package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.purchase.dto.PurchaseOrderResponse;
import com.naren.erpbackend.purchase.dto.PurchaseOrderResponseMapper;
import com.naren.erpbackend.purchase.entity.PurchaseOrder;
import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;
import com.naren.erpbackend.purchase.repository.PurchaseOrderRepository;
import com.naren.erpbackend.purchase.repository.PurchaseOrderSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PurchaseOrderQServiceImpl implements PurchaseOrderQService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderResponseMapper responseMapper;

    @Override
    public PurchaseOrderResponse findPurchaseOrderById(Long id) {
        log.info("Fetch purchase order: id={}", id);

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found: " + id));

        return responseMapper.apply(purchaseOrder);
    }

    @Override
    public Page<PurchaseOrderResponse> findAllPurchaseOrders(Pageable pageable) {
        log.info("Fetch all purchase orders: pageable={}", pageable);

        return purchaseOrderRepository.findAll(pageable).map(responseMapper);
    }

    @Override
    public Page<PurchaseOrderResponse> searchPurchaseOrders(String keyword, Pageable pageable) {
        log.info("Search purchase orders: keyword={}", keyword);

        return purchaseOrderRepository.searchPurchaseOrders(keyword, pageable).map(responseMapper);
    }

    @Override
    public Page<PurchaseOrderResponse> filterPurchaseOrders(String keyword, PurchaseOrderStatus status, Long supplierId, Long userId, Pageable pageable) {
        log.info("Filter purchase orders: keyword={}, status={}, supplierId={}, userId={}", keyword, status, supplierId, userId);

        Specification<PurchaseOrder> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(PurchaseOrderSpecifications.keywordLike(keyword.trim()));
        }
        if (status != null) {
            spec = spec.and(PurchaseOrderSpecifications.hasStatus(status));
        }
        if (supplierId != null) {
            spec = spec.and(PurchaseOrderSpecifications.hasSupplier(supplierId));
        }
        if (userId != null) {
            spec = spec.and(PurchaseOrderSpecifications.belongsToUser(userId));
        }

        return purchaseOrderRepository.findAll(spec, pageable).map(responseMapper);
    }

    @Override
    public Page<PurchaseOrderResponse> findPurchaseOrdersByUser(Long userId, Pageable pageable) {
        log.info("Fetch purchase orders by user: userId={}", userId);

        return purchaseOrderRepository.findByUserId(userId, pageable).map(responseMapper);
    }
}
