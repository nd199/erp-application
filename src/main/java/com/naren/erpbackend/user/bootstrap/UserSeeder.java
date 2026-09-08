package com.naren.erpbackend.user.bootstrap;

import com.naren.erpbackend.user.entity.Role;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
import com.naren.erpbackend.user.repository.RoleRepository;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class UserSeeder implements CommandLineRunner {

    private final UserProfileRepository userProfileRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seeder.admin.username:superadmin}")
    private String adminUsername;

    @Value("${app.seeder.admin.email:admin@erp.local}")
    private String adminEmail;

    @Value("${app.seeder.admin.password:admin123}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(String... args) {
        if (userProfileRepository.existsByUsernameAndDeletedFalse(adminUsername)) {
            log.info("Admin user '{}' already exists, skipping seed", adminUsername);
            return;
        }

        Role superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                .orElseThrow(() -> new IllegalStateException("SUPER_ADMIN role not found"));

        UserProfile admin = UserProfile.builder()
                .username(adminUsername)
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .phone("0000000000")
                .address("System Default")
                .status(UserStatus.ACTIVE)
                .roles(Set.of(superAdminRole))
                .build();

        userProfileRepository.save(admin);
        log.info("Seeded admin user: username={}, email={}", adminUsername, adminEmail);
    }
}
