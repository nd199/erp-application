package com.naren.erpbackend.purchase.repository;

import com.naren.erpbackend.purchase.entity.Supplier;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public final class SupplierSpecifications {

    private SupplierSpecifications() {
    }

    public static Specification<Supplier> keywordLike(String keyword) {
        return (root, query, cb) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";
            Predicate name = cb.like(cb.lower(root.get("name")), pattern);
            Predicate contact = cb.like(cb.lower(root.get("contactPerson")), pattern);
            Predicate email = cb.like(cb.lower(root.get("email")), pattern);
            return cb.or(name, contact, email);
        };
    }

    public static Specification<Supplier> isActive(boolean active) {
        return (root, query, cb) -> cb.equal(root.get("active"), active);
    }
}
