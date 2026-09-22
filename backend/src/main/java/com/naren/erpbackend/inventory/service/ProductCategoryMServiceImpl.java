package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.inventory.dto.ProductCategoryRequest;
import com.naren.erpbackend.inventory.dto.ProductCategoryResponse;
import com.naren.erpbackend.inventory.dto.ProductCategoryResponseMapper;
import com.naren.erpbackend.inventory.entity.ProductCategory;
import com.naren.erpbackend.inventory.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductCategoryMServiceImpl implements ProductCategoryMService {

    private final ProductCategoryRepository categoryRepository;
    private final ProductCategoryResponseMapper responseMapper;

    @Override
    public ProductCategoryResponse createCategory(ProductCategoryRequest request) {
        log.info("Create category: name={}", request.name());

        if (categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new ResourceExistsException("Category '" + request.name() + "' already exists");
        }

        try {
            ProductCategory category = ProductCategory.builder()
                    .name(request.name())
                    .description(request.description())
                    .active(true)
                    .build();
            ProductCategory saved = categoryRepository.save(category);
            log.info("Category created: id={}, name={}", saved.getId(), saved.getName());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Category '" + request.name() + "' already exists", e);
        }
    }

    @Override
    public ProductCategoryResponse updateCategory(Long id, ProductCategoryRequest request) {
        log.info("Update category: id={}", id);

        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        if (!category.getName().equalsIgnoreCase(request.name())
                && categoryRepository.existsByNameIgnoreCase(request.name())) {
            throw new ResourceExistsException("Category '" + request.name() + "' already exists");
        }

        category.setName(request.name());
        category.setDescription(request.description());
        category.setLastUpdated(Instant.now());

        try {
            ProductCategory saved = categoryRepository.save(category);
            log.info("Category updated: id={}, name={}", saved.getId(), saved.getName());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Category '" + request.name() + "' already exists", e);
        }
    }

    @Override
    public void deleteCategory(Long id) {
        log.info("Delete category: id={}", id);

        ProductCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + id));

        try {
            categoryRepository.delete(category);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Category cannot be deleted due to existing references", e);
        }

        log.info("Category deleted: id={}", id);
    }
}
