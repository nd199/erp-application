package com.naren.erpbackend.common.util;

import java.util.Locale;

public abstract class StringNormalizeUtil {

    protected static String normalize(String value) {
        return value.trim();
    }

    protected static String normalizeLowerCase(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }

    protected static String normalizeNullable(String value) {
        return value != null ? value.trim() : null;
    }
}
