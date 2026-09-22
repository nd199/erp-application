package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.inventory.dto.ProductCategoryRequest;
import com.naren.erpbackend.inventory.dto.ProductCategoryResponse;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface ProductCategoryMService {

    ProductCategoryResponse createCategory(ProductCategoryRequest request);

    ProductCategoryResponse updateCategory(Long id, ProductCategoryRequest request);

    void deleteCategory(Long id);
}
