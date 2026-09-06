package com.naren.erpbackend.user.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserUtilityTest {

    private static class TestableUtility extends UserUtility {
        static String testNormalize(String username) {
            return normalizeUsername(username);
        }

        static String testNormalizeEmail(String email) {
            return normalizeEmail(email);
        }
    }

    @Test
    void trimsUsername() {
        assertThat(TestableUtility
                .testNormalize("  johndoe  ")
        ).isEqualTo("johndoe");
    }

    @Test
    void preservesUsernameCase() {
        assertThat(TestableUtility
                .testNormalize("John.Doe")
        ).isEqualTo("John.Doe");
    }

    @Test
    void trimsAndLowercasesEmail() {
        assertThat(TestableUtility
                .testNormalizeEmail("  JOHN@Example.COM  ")
        ).isEqualTo("john@example.com");
    }

    @Test
    void lowercasesEmailUsingRootLocale() {
        assertThat(TestableUtility
                .testNormalizeEmail("JOHN@EXAMPLE.COM")
        ).isEqualTo("john@example.com");
    }
}
