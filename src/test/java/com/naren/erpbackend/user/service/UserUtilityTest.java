package com.naren.erpbackend.user.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserUtilityTest {

    private static class TestableUtility extends UserUtility {
        static String normalize(String username) {
            return normalizeUsername(username);
        }

        static String normalizeMail(String email) {
            return normalizeEmail(email);
        }
    }

    @Test
    void trimsUsername() {
        assertThat(TestableUtility.normalize("  johndoe  ")).isEqualTo("johndoe");
    }

    @Test
    void preservesUsernameCase() {
        assertThat(TestableUtility.normalize("John.Doe")).isEqualTo("John.Doe");
    }

    @Test
    void trimsAndLowercasesEmail() {
        assertThat(TestableUtility.normalizeMail("  JOHN@Example.COM  ")).isEqualTo("john@example.com");
    }

    @Test
    void lowercasesEmailUsingRootLocale() {
        assertThat(TestableUtility.normalizeMail("JOHN@EXAMPLE.COM")).isEqualTo("john@example.com");
    }
}
