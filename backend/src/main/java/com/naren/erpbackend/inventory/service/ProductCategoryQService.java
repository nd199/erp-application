package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.inventory.dto.ProductCategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface ProductCategoryQService {

    ProductCategoryResponse findCategoryById(Long id);

    Page<ProductCategoryResponse> findAllCategories(Pageable pageable);

    Page<ProductCategoryResponse> searchCategories(String keyword, Pageable pageable);
}
