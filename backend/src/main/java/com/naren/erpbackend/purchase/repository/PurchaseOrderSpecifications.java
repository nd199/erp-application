package com.naren.erpbackend.purchase.repository;

import com.naren.erpbackend.purchase.entity.PurchaseOrder;
import com.naren.erpbackend.purchase.entity.PurchaseOrderStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public final class PurchaseOrderSpecifications {

    private PurchaseOrderSpecifications() {
    }

    public static Specification<PurchaseOrder> keywordLike(String keyword) {
        return (root, query, cb) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";
            Predicate notes = cb.like(cb.lower(root.get("notes")), pattern);
            Predicate status = cb.like(cb.lower(root.get("status").as(String.class)), pattern);
            Predicate supplier = cb.like(cb.lower(root.get("supplier").get("name")), pattern);
            return cb.or(notes, status, supplier);
        };
    }

    public static Specification<PurchaseOrder> hasStatus(PurchaseOrderStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<PurchaseOrder> belongsToUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<PurchaseOrder> hasSupplier(Long supplierId) {
        return (root, query, cb) -> cb.equal(root.get("supplier").get("id"), supplierId);
    }
}
