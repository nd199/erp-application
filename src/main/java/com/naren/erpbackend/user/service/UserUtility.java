package com.naren.erpbackend.user.service;

import com.naren.erpbackend.common.util.StringNormalizeUtil;

public abstract class UserUtility extends StringNormalizeUtil {

    protected static String normalizeUsername(String username) {
        return normalize(username);
    }

    protected static String normalizeEmail(String email) {
        return normalizeLowerCase(email);
    }

    protected static String normalizePhone(String phone) {
        return normalize(phone);
    }

    protected static String normalizeAddress(String address) {
        return normalize(address);
    }
}
