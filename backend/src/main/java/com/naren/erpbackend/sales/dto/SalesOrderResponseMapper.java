package com.naren.erpbackend.sales.dto;

import com.naren.erpbackend.sales.entity.SalesOrder;
import com.naren.erpbackend.sales.entity.SalesOrderItem;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

@Component
public class SalesOrderResponseMapper implements Function<SalesOrder, SalesOrderResponse> {

    @Override
    public SalesOrderResponse apply(SalesOrder order) {
        List<SalesOrderItemResponse> items = order.getItems().stream()
                .sorted(Comparator.comparing(SalesOrderItem::getId))
                .map(this::toItemResponse)
                .toList();

        return new SalesOrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getUser().getEmail(),
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

    private SalesOrderItemResponse toItemResponse(SalesOrderItem item) {
        return new SalesOrderItemResponse(
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