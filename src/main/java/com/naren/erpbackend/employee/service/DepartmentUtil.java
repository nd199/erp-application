package com.naren.erpbackend.employee.service;

public abstract class DepartmentUtil {

    protected static String normalizeName(String name) {
        return name.trim();
    }

    protected static String normalizeDescription(String description) {
        return description != null ? description.trim() : null;
    }
}
