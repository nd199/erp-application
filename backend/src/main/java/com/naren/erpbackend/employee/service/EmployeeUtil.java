package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.util.StringNormalizeUtil;

public abstract class EmployeeUtil extends StringNormalizeUtil {

    protected static String normalizeName(String name) {
        return normalize(name);
    }

    protected static String normalizeEmail(String email) {
        return normalizeLowerCase(email);
    }

    protected static String normalizePhone(String phone) {
        return normalize(phone);
    }

    protected static String normalizeDescription(String description) {
        return normalizeNullable(description);
    }
}
