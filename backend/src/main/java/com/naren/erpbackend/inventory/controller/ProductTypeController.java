package com.naren.erpbackend.inventory.controller;

import com.naren.erpbackend.inventory.dto.ProductTypeRequest;
import com.naren.erpbackend.inventory.dto.ProductTypeResponse;
import com.naren.erpbackend.inventory.service.ProductTypeMService;
import com.naren.erpbackend.inventory.service.ProductTypeQService;
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
@RequestMapping("/api/v1/product-types")
public class ProductTypeController {

    private final ProductTypeMService typeMService;
    private final ProductTypeQService typeQService;

    @PostMapping
    @PreAuthorize("hasAuthority('PRODUCT_CREATE')")
    public ResponseEntity<ProductTypeResponse> createType(@Valid @RequestBody ProductTypeRequest request) {
        log.info("Create type: name={}", request.name());
        ProductTypeResponse response = typeMService.createType(request);
        log.info("Type created: id={}, name={}", response.id(), response.name());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<ProductTypeResponse> getTypeById(@PathVariable Long id) {
        log.info("Fetch type: id={}", id);
        return ResponseEntity.ok(typeQService.findTypeById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<Page<ProductTypeResponse>> getAllTypes(Pageable pageable) {
        log.info("Fetch all types: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(typeQService.findAllTypes(pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PRODUCT_READ')")
    public ResponseEntity<Page<ProductTypeResponse>> searchTypes(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search types: keyword={}", keyword);
        return ResponseEntity.ok(typeQService.searchTypes(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_UPDATE')")
    public ResponseEntity<ProductTypeResponse> updateType(
            @PathVariable Long id,
            @Valid @RequestBody ProductTypeRequest request) {
        log.info("Update type: id={}", id);
        return ResponseEntity.ok(typeMService.updateType(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_DELETE')")
    public ResponseEntity<Void> deleteType(@PathVariable Long id) {
        log.info("Delete type: id={}", id);
        typeMService.deleteType(id);
        return ResponseEntity.noContent().build();
    }
}
