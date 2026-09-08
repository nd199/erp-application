package com.naren.erpbackend.employee.service;

import com.naren.erpbackend.common.util.StringNormalizeUtil;

public abstract class DepartmentUtil extends StringNormalizeUtil {

    protected static String normalizeName(String name) {
        return normalize(name);
    }

    protected static String normalizeDescription(String description) {
        return normalizeNullable(description);
    }
}
