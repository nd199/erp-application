package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.common.util.SecurityUtils;
import com.naren.erpbackend.inventory.entity.Product;
import com.naren.erpbackend.inventory.repository.ProductRepository;
import com.naren.erpbackend.purchase.dto.*;
import com.naren.erpbackend.purchase.entity.PurchaseOrder;
import com.naren.erpbackend.purchase.entity.PurchaseOrderItem;
import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;
import com.naren.erpbackend.purchase.entity.Supplier;
import com.naren.erpbackend.purchase.repository.PurchaseOrderRepository;
import com.naren.erpbackend.purchase.repository.SupplierRepository;
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

import static com.naren.erpbackend.purchase.entity.PurchaseOrderStatus.PENDING;
import static com.naren.erpbackend.user.entity.UserStatus.ACTIVE;
import static java.math.BigDecimal.ZERO;

@Service
@RequiredArgsConstructor
@Slf4j
public class PurchaseOrderMServiceImpl implements PurchaseOrderMService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final UserProfileRepository userProfileRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderResponseMapper responseMapper;

    @Override
    public PurchaseOrderResponse createPurchaseOrder(PurchaseOrderRequest request) {

        Supplier supplier = supplierRepository.findById(request.supplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found: " + request.supplierId()));

        UserProfile user = userProfileRepository.findByIdAndStatusAndDeletedFalse(
                request.userId(), ACTIVE).orElseThrow(
                () -> new ResourceNotFoundException("User Not Found")
        );

        PurchaseOrder purchaseOrder = PurchaseOrder.builder()
                .supplier(supplier)
                .user(user)
                .orderDate(Objects.nonNull(request.orderDate()) ? request.orderDate() : Instant.now())
                .status(PENDING)
                .totalAmount(ZERO)
                .notes(Objects.nonNull(request.notes()) ? request.notes() : null)
                .build();

        Set<PurchaseOrderItem> items = new HashSet<>();

        for (PurchaseOrderItemRequest item : request.items()) {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product Not Found: " + item.productId())
                    );
            BigDecimal unitPrice = item.unitPrice() != null ? item.unitPrice() : product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.quantity()));

            items.add(PurchaseOrderItem.builder()
                    .order(purchaseOrder)
                    .product(product)
                    .quantity(item.quantity())
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build());
        }
        purchaseOrder.getItems().addAll(items);
        purchaseOrder.setTotalAmount(items.stream()
                .map(PurchaseOrderItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        purchaseOrderRepository.save(purchaseOrder);
        return responseMapper.apply(purchaseOrder);
    }

    @Override
    public PurchaseOrderResponse updatePurchaseOrder(Long id, PurchaseOrderUpdateRequest request) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found: " + id));

        if (!purchaseOrder.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("You can only modify your own orders");
        }

        if (request.orderDate() != null && !Objects.equals(purchaseOrder.getOrderDate(),
                request.orderDate())) {
            purchaseOrder.setOrderDate(request.orderDate());
        }

        if (request.notes() != null && !Objects.equals(purchaseOrder.getNotes(),
                request.notes())) {
            purchaseOrder.setNotes(request.notes());
        }

        if (request.items() != null) {
            Set<PurchaseOrderItem> newItems = new HashSet<>();
            for (PurchaseOrderItemRequest item : request.items()) {
                Product product = productRepository.findById(item.productId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Product Not Found: " + item.productId())
                        );
                BigDecimal unitPrice = item.unitPrice() != null ? item.unitPrice() : product.getPrice();
                BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.quantity()));

                newItems.add(PurchaseOrderItem.builder()
                        .order(purchaseOrder)
                        .product(product)
                        .quantity(item.quantity())
                        .unitPrice(unitPrice)
                        .lineTotal(lineTotal)
                        .build());
            }

            purchaseOrder.getItems().clear();
            purchaseOrder.getItems().addAll(newItems);

            purchaseOrder.setTotalAmount(newItems.stream()
                    .map(PurchaseOrderItem::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add));
        }

        purchaseOrder.setLastUpdated(Instant.now());
        purchaseOrderRepository.save(purchaseOrder);
        return responseMapper.apply(purchaseOrder);
    }

    @Override
    public PurchaseOrderResponse updatePurchaseOrderStatus(Long id, PurchaseOrderStatus status) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found: " + id));
        if (!purchaseOrder.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("You can only modify your own orders");
        }
        purchaseOrder.setStatus(status);
        purchaseOrder.setLastUpdated(Instant.now());
        purchaseOrderRepository.save(purchaseOrder);
        return responseMapper.apply(purchaseOrder);
    }

    @Override
    public void deletePurchaseOrder(Long id) {
        PurchaseOrder purchaseOrder = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found: " + id));
        if (!purchaseOrder.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("You can only delete your own orders");
        }
        purchaseOrderRepository.delete(purchaseOrder);
    }
}
