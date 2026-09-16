package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.inventory.dto.ProductResponse;
import com.naren.erpbackend.inventory.dto.ProductResponseMapper;
import com.naren.erpbackend.inventory.entity.Product;
import com.naren.erpbackend.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductQServiceImpl implements ProductQService {

    private final ProductRepository productRepository;
    private final ProductResponseMapper responseMapper;

    @Override
    public ProductResponse findProductById(Long id) {
        log.info("Fetch product: id={}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        return responseMapper.apply(product);
    }

    @Override
    public Page<ProductResponse> findAllProducts(Pageable pageable) {
        log.info("Fetch all products: pageable={}", pageable);

        return productRepository.findAll(pageable).map(responseMapper);
    }

    @Override
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        log.info("Search products: keyword={}, pageable={}", keyword, pageable);

        return productRepository.searchProducts(keyword, pageable).map(responseMapper);
    }
}