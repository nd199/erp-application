package com.naren.erpbackend.user.service;

import java.util.Locale;

public abstract class UserUtility {

    protected static String normalizeUsername(String username) {
        return username.trim();
    }

    protected static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
