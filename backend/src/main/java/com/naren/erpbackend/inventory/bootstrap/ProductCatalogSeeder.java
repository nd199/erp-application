package com.naren.erpbackend.inventory.bootstrap;

import com.naren.erpbackend.inventory.entity.ProductCategory;
import com.naren.erpbackend.inventory.entity.ProductType;
import com.naren.erpbackend.inventory.repository.ProductCategoryRepository;
import com.naren.erpbackend.inventory.repository.ProductTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Slf4j
@Component
@Order(1)
@RequiredArgsConstructor
public class ProductCatalogSeeder implements CommandLineRunner {

    private final ProductCategoryRepository categoryRepository;
    private final ProductTypeRepository typeRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Seeding product catalog data (categories, types)");

        Map<String, String> categories = Map.of(
                "Laptops & Notebooks", "Portable computing devices including ultrabooks, workstations, and Chromebooks",
                "Monitors & Displays", "Desktop monitors, portable displays, digital signage, and projector screens",
                "Input Devices", "Keyboards, mice, trackpads, styluses, and ergonomic input peripherals",
                "Audio & Video", "Headphones, speakers, webcams, microphones, and conferencing equipment",
                "Networking", "Switches, routers, access points, cables, and network infrastructure",
                "Power & UPS", "Uninterruptible power supplies, surge protectors, PDUs, and battery backups",
                "Storage", "External SSDs, hard drives, NAS devices, and backup solutions",
                "Accessories & Peripherals", "Docking stations, laptop stands, cable organizers, and misc accessories"
        );

        Map<String, String> types = Map.of(
                "Hardware", "Physical equipment and tangible computing devices",
                "Software", "Licensed software, SaaS subscriptions, and digital tools",
                "Accessory", "Add-on peripherals and complementary products",
                "Service", "Installation, maintenance, consulting, and support services",
                "Consumable", "Disposable items like cables, toner, paper, and batteries"
        );

        for (Map.Entry<String, String> entry : categories.entrySet()) {
            if (!categoryRepository.existsByNameIgnoreCase(entry.getKey())) {
                categoryRepository.save(ProductCategory.builder()
                        .name(entry.getKey())
                        .description(entry.getValue())
                        .active(true)
                        .build());
                log.info("Created category: {}", entry.getKey());
            }
        }

        for (Map.Entry<String, String> entry : types.entrySet()) {
            if (!typeRepository.existsByNameIgnoreCase(entry.getKey())) {
                typeRepository.save(ProductType.builder()
                        .name(entry.getKey())
                        .description(entry.getValue())
                        .active(true)
                        .build());
                log.info("Created type: {}", entry.getKey());
            }
        }

        log.info("Product catalog seeding complete");
    }
}
