package com.naren.erpbackend.user.service;

import java.util.Locale;

public abstract class UserUtility {

    protected static String normalizeUsername(String username) {
        return username.trim();
    }

    protected static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    protected static String normalizePhone(String phone) {
        return phone.trim();
    }

    protected static String normalizeAddress(String address) {
        return address.trim();
    }
}
