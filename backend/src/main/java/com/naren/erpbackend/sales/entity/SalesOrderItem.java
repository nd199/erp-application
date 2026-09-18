package com.naren.erpbackend.sales.entity;

import com.naren.erpbackend.inventory.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "sales_order_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class SalesOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private SalesOrder order;

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
