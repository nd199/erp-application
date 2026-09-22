package com.naren.erpbackend.purchase.dto;

import com.naren.erpbackend.purchase.entity.PurchaseOrder;
import com.naren.erpbackend.purchase.entity.PurchaseOrderItem;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

@Component
public class PurchaseOrderResponseMapper implements Function<PurchaseOrder, PurchaseOrderResponse> {

    @Override
    public PurchaseOrderResponse apply(PurchaseOrder order) {
        List<PurchaseOrderItemResponse> items = order.getItems().stream()
                .sorted(Comparator.comparing(PurchaseOrderItem::getId))
                .map(this::toItemResponse)
                .toList();

        return new PurchaseOrderResponse(
                order.getId(),
                order.getSupplier().getId(),
                order.getSupplier().getName(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getNotes(),
                items,
                order.getVersion(),
                order.getCreatedAt(),
                order.getLastUpdated()
        );
    }

    private PurchaseOrderItemResponse toItemResponse(PurchaseOrderItem item) {
        return new PurchaseOrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getSku(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getLineTotal()
        );
    }
}
