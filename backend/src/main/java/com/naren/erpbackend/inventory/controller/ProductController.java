package com.naren.erpbackend.inventory.controller;

import com.naren.erpbackend.inventory.dto.ProductRequest;
import com.naren.erpbackend.inventory.dto.ProductResponse;
import com.naren.erpbackend.inventory.service.ProductMService;
import com.naren.erpbackend.inventory.service.ProductQService;
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
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductMService productMService;
    private final ProductQService productQService;

    @PostMapping
    @PreAuthorize("hasAuthority('PRODUCT_CREATE')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        log.info("Create product: name={}, sku={}", request.name(), request.sku());
        ProductResponse response = productMService.createProduct(request);
        log.info("Product created: id={}, name={}", response.id(), response.name());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        log.info("Fetch product: id={}", id);
        ProductResponse response = productQService.findProductById(id);
        log.info("Product fetched: id={}, name={}", response.id(), response.name());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<Page<ProductResponse>> getAllProducts(Pageable pageable) {
        log.info("Fetch all products: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(productQService.findAllProducts(pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search products: keyword={}", keyword);
        return ResponseEntity.ok(productQService.searchProducts(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        log.info("Update product: id={}", id);
        ProductResponse response = productMService.updateProduct(id, request);
        log.info("Product updated: id={}, name={}", response.id(), response.name());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_DELETE')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        log.info("Delete product: id={}", id);
        productMService.deleteProduct(id);
        log.info("Product deleted: id={}", id);
        return ResponseEntity.noContent().build();
    }
}