package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.inventory.dto.ProductCategoryResponse;
import com.naren.erpbackend.inventory.dto.ProductCategoryResponseMapper;
import com.naren.erpbackend.inventory.entity.ProductCategory;
import com.naren.erpbackend.inventory.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductCategoryQServiceImpl implements ProductCategoryQService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductCategoryResponseMapper responseMapper;

    @Override
    public ProductCategoryResponse findCategoryById(Long id) {
        log.info("Fetch category: id={}", id);
        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));
        return responseMapper.apply(category);
    }

    @Override
    public Page<ProductCategoryResponse> findAllCategories(Pageable pageable) {
        log.info("Fetch all categories: pageable={}", pageable);
        return categoryRepository.findAll(pageable).map(responseMapper);
    }

    @Override
    public Page<ProductCategoryResponse> searchCategories(String keyword, Pageable pageable) {
        log.info("Search categories: keyword={}", keyword);
        return categoryRepository.searchCategories(keyword, pageable).map(responseMapper);
    }
}
