package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.purchase.dto.SupplierResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface SupplierQService {

    SupplierResponse findSupplierById(Long id);

    Page<SupplierResponse> findAllSuppliers(Pageable pageable);

    Page<SupplierResponse> searchSuppliers(String keyword, Pageable pageable);

    Page<SupplierResponse> filterSuppliers(String keyword, Boolean active, Pageable pageable);
}
