package com.naren.erpbackend.employee.repository;

import com.naren.erpbackend.employee.entity.Employee;
import com.naren.erpbackend.user.entity.UserStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public final class EmployeeSpecifications {

    private EmployeeSpecifications() {
    }

    public static Specification<Employee> notDeleted() {
        return (root, query, cb) -> cb.isFalse(root.get("deleted"));
    }

    public static Specification<Employee> departmentNameLike(String keyword) {
        return (root, query, cb) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";
            Predicate firstName = cb.like(cb.lower(root.get("firstName")), pattern);
            Predicate lastName = cb.like(cb.lower(root.get("lastName")), pattern);
            Predicate email = cb.like(cb.lower(root.get("email")), pattern);
            Predicate jobTitle = cb.like(cb.lower(root.get("jobTitle")), pattern);
            Predicate phone = cb.like(cb.lower(root.get("phone")), pattern);
            return cb.or(firstName, lastName, email, jobTitle, phone);
        };
    }

    public static Specification<Employee> hasStatus(UserStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Employee> inDepartment(Long departmentId) {
        return (root, query, cb) -> cb.equal(root.get("department").get("id"), departmentId);
    }
}