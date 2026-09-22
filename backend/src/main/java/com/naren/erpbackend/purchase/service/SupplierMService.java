package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.purchase.dto.SupplierRequest;
import com.naren.erpbackend.purchase.dto.SupplierResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface SupplierMService {

    SupplierResponse createSupplier(SupplierRequest request);

    SupplierResponse updateSupplier(Long id, SupplierRequest request);

    void deleteSupplier(Long id);
}
