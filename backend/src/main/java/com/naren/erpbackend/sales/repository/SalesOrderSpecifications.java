package com.naren.erpbackend.sales.repository;

import com.naren.erpbackend.sales.entity.OrderStatus;
import com.naren.erpbackend.sales.entity.SalesOrder;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public final class SalesOrderSpecifications {

    private SalesOrderSpecifications() {
    }

    public static Specification<SalesOrder> keywordLike(String keyword) {
        return (root, query, cb) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";
            Predicate notes = cb.like(cb.lower(root.get("notes")), pattern);
            Predicate status = cb.like(cb.lower(root.get("status").as(String.class)), pattern);
            return cb.or(notes, status);
        };
    }

    public static Specification<SalesOrder> hasStatus(OrderStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<SalesOrder> belongsToUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }
}