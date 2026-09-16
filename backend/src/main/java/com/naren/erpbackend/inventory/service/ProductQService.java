package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.inventory.dto.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface ProductQService {

    ProductResponse findProductById(Long id);

    Page<ProductResponse> findAllProducts(Pageable pageable);

    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);
}