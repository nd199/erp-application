package com.naren.erpbackend.purchase.controller;

import com.naren.erpbackend.purchase.dto.SupplierRequest;
import com.naren.erpbackend.purchase.dto.SupplierResponse;
import com.naren.erpbackend.purchase.service.SupplierMService;
import com.naren.erpbackend.purchase.service.SupplierQService;
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
@RequestMapping("/api/v1/suppliers")
public class SupplierController {

    private final SupplierMService supplierMService;
    private final SupplierQService supplierQService;

    @PostMapping
    @PreAuthorize("hasAuthority('PURCHASE_CREATE')")
    public ResponseEntity<SupplierResponse> createSupplier(@Valid @RequestBody SupplierRequest request) {
        log.info("Create supplier: name={}", request.name());
        SupplierResponse response = supplierMService.createSupplier(request);
        log.info("Supplier created: id={}, name={}", response.id(), response.name());
        return ResponseEntity.status(CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('PURCHASE_READ')")
    public ResponseEntity<SupplierResponse> getSupplierById(@PathVariable Long id) {
        log.info("Fetch supplier: id={}", id);
        return ResponseEntity.ok(supplierQService.findSupplierById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('PURCHASE_READ')")
    public ResponseEntity<Page<SupplierResponse>> getAllSuppliers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean active,
            Pageable pageable) {
        log.info("Fetch suppliers: search={}, active={}, page={}, size={}",
                search, active, pageable.getPageNumber(), pageable.getPageSize());
        return ResponseEntity.ok(supplierQService.filterSuppliers(search, active, pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('PURCHASE_READ')")
    public ResponseEntity<Page<SupplierResponse>> searchSuppliers(
            @RequestParam("keyword") String keyword, Pageable pageable) {
        log.info("Search suppliers: keyword={}", keyword);
        return ResponseEntity.ok(supplierQService.searchSuppliers(keyword, pageable));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('PURCHASE_UPDATE')")
    public ResponseEntity<SupplierResponse> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierRequest request) {
        log.info("Update supplier: id={}", id);
        return ResponseEntity.ok(supplierMService.updateSupplier(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PURCHASE_DELETE')")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        log.info("Delete supplier: id={}", id);
        supplierMService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}
