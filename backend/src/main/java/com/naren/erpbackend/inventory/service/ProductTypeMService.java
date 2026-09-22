package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.inventory.dto.ProductTypeRequest;
import com.naren.erpbackend.inventory.dto.ProductTypeResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface ProductTypeMService {

    ProductTypeResponse createType(ProductTypeRequest request);

    ProductTypeResponse updateType(Long id, ProductTypeRequest request);

    void deleteType(Long id);
}
