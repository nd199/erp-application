package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.inventory.dto.ProductTypeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface ProductTypeQService {

    ProductTypeResponse findTypeById(Long id);

    Page<ProductTypeResponse> findAllTypes(Pageable pageable);

    Page<ProductTypeResponse> searchTypes(String keyword, Pageable pageable);
}
