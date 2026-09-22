package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.purchase.dto.SupplierResponse;
import com.naren.erpbackend.purchase.dto.SupplierResponseMapper;
import com.naren.erpbackend.purchase.entity.Supplier;
import com.naren.erpbackend.purchase.repository.SupplierRepository;
import com.naren.erpbackend.purchase.repository.SupplierSpecifications;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupplierQServiceImpl implements SupplierQService {

    private final SupplierRepository supplierRepository;
    private final SupplierResponseMapper responseMapper;

    @Override
    public SupplierResponse findSupplierById(Long id) {
        log.info("Fetch supplier: id={}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found: " + id));

        return responseMapper.apply(supplier);
    }

    @Override
    public Page<SupplierResponse> findAllSuppliers(Pageable pageable) {
        log.info("Fetch all suppliers: pageable={}", pageable);

        return supplierRepository.findAll(pageable).map(responseMapper);
    }

    @Override
    public Page<SupplierResponse> searchSuppliers(String keyword, Pageable pageable) {
        log.info("Search suppliers: keyword={}", keyword);

        return supplierRepository.searchSuppliers(keyword, pageable).map(responseMapper);
    }

    @Override
    public Page<SupplierResponse> filterSuppliers(String keyword, Boolean active, Pageable pageable) {
        log.info("Filter suppliers: keyword={}, active={}", keyword, active);

        Specification<Supplier> spec = (root, query, cb) -> cb.conjunction();

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(SupplierSpecifications.keywordLike(keyword.trim()));
        }
        if (active != null) {
            spec = spec.and(SupplierSpecifications.isActive(active));
        }

        return supplierRepository.findAll(spec, pageable).map(responseMapper);
    }
}
