package com.naren.erpbackend.purchase.entity;

import com.naren.erpbackend.inventory.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private PurchaseOrder order;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", columnDefinition = "NUMERIC(12, 2)", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "line_total", columnDefinition = "NUMERIC(14, 2)", nullable = false)
    private BigDecimal lineTotal;
}
