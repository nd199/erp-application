package com.naren.erpbackend.common.util;

import com.naren.erpbackend.security.SecurityUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public abstract class SecurityUtils {

    private SecurityUtils() {
    }

    public static SecurityUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof SecurityUser user)) {
            throw new IllegalStateException("No authenticated user found in security context");
        }
        return user;
    }

    public static Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }

    public static String getCurrentUsername() {
        return getCurrentUser().getUsername();
    }
}