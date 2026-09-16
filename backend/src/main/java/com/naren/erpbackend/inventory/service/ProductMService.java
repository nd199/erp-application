package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.inventory.dto.ProductRequest;
import com.naren.erpbackend.inventory.dto.ProductResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface ProductMService {

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);
}