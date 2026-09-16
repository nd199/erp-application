package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.common.util.StringNormalizeUtil;

public abstract class ProductUtil extends StringNormalizeUtil {

    protected static String normalizeName(String name) {
        return normalize(name);
    }

    protected static String normalizeSku(String sku) {
        return normalizeLowerCase(sku);
    }

    protected static String normalizeDescription(String description) {
        return normalize(description);
    }

    protected static String normalizeImageUrl(String imageUrl) {
        return normalizeNullable(imageUrl);
    }
}