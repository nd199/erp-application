package com.naren.erpbackend.common.util;

import java.util.Locale;

public abstract class StringNormalizeUtil {

    public static String normalize(String value) {
        return value.trim();
    }

    public static String normalizeLowerCase(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }

    public static String normalizeNullable(String value) {
        return value != null ? value.trim() : null;
    }
}
