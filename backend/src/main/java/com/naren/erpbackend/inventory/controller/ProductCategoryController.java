package com.naren.erpbackend.inventory.controller;

import com.naren.erpbackend.inventory.dto.ProductCategoryRequest;
import com.naren.erpbackend.inventory.dto.ProductCategoryResponse;
import com.naren.erpbackend.inventory.service.ProductCategoryMService;
import com.naren.erpbackend.inventory.service.ProductCategoryQService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/product-categories")
public class ProductCategoryController {

    private final ProductCategoryMService categoryMService;
    private final ProductCategoryQService categoryQService;

    @PostMapping
    @PreAuthorize("hasAuthority('PRODUCT_CREATE')")
    public ResponseEntity<ProductCategoryResponse> createCategory(@Valid @RequestBody ProductCategoryRequest request) {
        log.info("Create category: name={}", request.name());
        ProductCategoryResponse response = categoryMService.createCategory(request);
        log.info("Category created: id={}, name={}", response.id(), response.name());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<ProductCategoryResponse> getCategoryById(@PathVariable Long id) {
        log.info("Fetch category: id={}", id);
        return ResponseEntity.ok(categoryQService.findCategoryById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<Page<ProductCategoryResponse>> getAllCategories(Pageable pageable) {
        log.info("Fetch all categories: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(categoryQService.findAllCategories(pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<Page<ProductCategoryResponse>> searchCategories(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search categories: keyword={}", keyword);
        return ResponseEntity.ok(categoryQService.searchCategories(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE')")
    public ResponseEntity<ProductCategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ProductCategoryRequest request) {
        log.info("Update category: id={}", id);
        return ResponseEntity.ok(categoryMService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_DELETE')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        log.info("Delete category: id={}", id);
        categoryMService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
