package com.naren.erpbackend.sales.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.inventory.entity.Product;
import com.naren.erpbackend.inventory.repository.ProductRepository;
import com.naren.erpbackend.sales.dto.*;
import com.naren.erpbackend.sales.entity.OrderStatus;
import com.naren.erpbackend.sales.entity.SalesOrder;
import com.naren.erpbackend.sales.entity.SalesOrderItem;
import com.naren.erpbackend.sales.repository.SalesOrderRepository;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import static com.naren.erpbackend.sales.entity.OrderStatus.PENDING;
import static com.naren.erpbackend.user.entity.UserStatus.ACTIVE;
import static java.math.BigDecimal.ZERO;

@Service
@RequiredArgsConstructor
@Slf4j
public class SalesOrderMServiceImpl implements SalesOrderMService {

    private final SalesOrderRepository salesOrderRepository;
    private final UserProfileRepository userProfileRepository;
    private final SalesOrderResponseMapper responseMapper;
    private final ProductRepository productRepository;


    @Override
    public SalesOrderResponse createSalesOrder(SalesOrderRequest request) {

        UserProfile user = userProfileRepository.findByIdAndStatusAndDeletedFalse(
                request.userId(), ACTIVE).orElseThrow(
                () -> new ResourceNotFoundException("User Not Found")
        );

        SalesOrder salesOrder = SalesOrder.builder()
                .user(user)
                .orderDate(Objects.nonNull(request.orderDate()) ? request.orderDate() : Instant.now())
                .status(PENDING)
                .totalAmount(ZERO)
                .notes(Objects.nonNull(request.notes()) ? request.notes() : null)
                .build();

        Set<SalesOrderItem> items = new HashSet<>();

        for (SalesOrderItemRequest item : request.items()) {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product Not Found" + item.productId())
                    );
            BigDecimal unitPrice = item.unitPrice() != null ? item.unitPrice() : product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.quantity()));

            items.add(SalesOrderItem.builder()
                    .order(salesOrder)
                    .product(product)
                    .quantity(item.quantity())
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build());
        }
        salesOrder.getItems().addAll(items);
        salesOrder.setTotalAmount(items.stream()
                .map(SalesOrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        salesOrderRepository.save(salesOrder);
        return responseMapper.apply(salesOrder);
    }

    @Override
    public SalesOrderResponse updateSalesOrder(Long id, SalesOrderUpdateRequest request) {

        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales Order Not Found: " + id)
                );

        if (!salesOrder.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("You can only modify your own orders");
        }

        if (request.orderDate() != null && !Objects.equals(salesOrder.getOrderDate(),
                request.orderDate())) {
            salesOrder.setOrderDate(request.orderDate());
        }

        if (request.notes() != null && !Objects.equals(salesOrder.getNotes(),
                request.notes())) {
            salesOrder.setNotes(request.notes());
        }

        if (request.items() != null) {
            Set<SalesOrderItem> newItems = new HashSet<>();
            for (SalesOrderItemRequest item : request.items()) {
                Product product = productRepository.findById(item.productId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product Not Found: " + item.productId())
                        );
                BigDecimal unitPrice = item.unitPrice() != null ? item.unitPrice() : product.getPrice();
                BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.quantity()));

                newItems.add(SalesOrderItem.builder()
                        .order(salesOrder)
                        .product(product)
                        .quantity(item.quantity())
                        .unitPrice(unitPrice)
                        .lineTotal(lineTotal)
                        .build());
            }

            salesOrder.getItems().clear();
            salesOrder.getItems().addAll(newItems);

            salesOrder.setTotalAmount(newItems.stream()
                    .map(SalesOrderItem::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
        }

        salesOrder.setLastUpdated(Instant.now());
        salesOrderRepository.save(salesOrder);
        return responseMapper.apply(salesOrder);
    }

    @Override
    public SalesOrderResponse updateSalesOrderStatus(Long id, OrderStatus status) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales Order Not Found: " + id)
                );
        if (!salesOrder.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("You can only modify your own orders");
        }
        salesOrder.setStatus(status);
        salesOrder.setLastUpdated(Instant.now());
        salesOrderRepository.save(salesOrder);
        return responseMapper.apply(salesOrder);
    }

    @Override
    public void deleteSalesOrder(Long id) {
        SalesOrder salesOrder = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales Order Not Found: " + id)
                );
        if (!salesOrder.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("You can only delete your own orders");
        }
        salesOrderRepository.delete(salesOrder);
    }
}
