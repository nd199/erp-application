package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.inventory.dto.ProductRequest;
import com.naren.erpbackend.inventory.dto.ProductResponse;
import com.naren.erpbackend.inventory.dto.ProductResponseMapper;
import com.naren.erpbackend.inventory.entity.Product;
import com.naren.erpbackend.inventory.entity.ProductCategory;
import com.naren.erpbackend.inventory.entity.ProductType;
import com.naren.erpbackend.inventory.repository.ProductCategoryRepository;
import com.naren.erpbackend.inventory.repository.ProductRepository;
import com.naren.erpbackend.inventory.repository.ProductTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductMServiceImpl extends ProductUtil implements ProductMService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductTypeRepository typeRepository;
    private final ProductResponseMapper responseMapper;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product: name={}, sku={}", request.name(), request.sku());

        String sku = normalizeSku(request.sku());
        if (productRepository.existsBySku(sku)) {
            throw new ResourceExistsException("Product with sku " + request.sku() + " taken");
        }

        try {
            ProductCategory category = request.categoryId() != null
                    ? categoryRepository.findById(request.categoryId())
                            .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.categoryId()))
                    : null;
            ProductType type = request.typeId() != null
                    ? typeRepository.findById(request.typeId())
                            .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + request.typeId()))
                    : null;

            Product product = Product.builder()
                    .name(normalizeName(request.name()))
                    .sku(sku)
                    .description(normalizeDescription(request.description()))
                    .imageUrl(normalizeImageUrl(request.imageUrl()))
                    .price(request.price())
                    .quantity(request.quantity())
                    .active(request.active())
                    .productCategory(category)
                    .productType(type)
                    .build();
            Product saved = productRepository.save(product);
            log.info("Product created: id={}, name={}, sku={}", saved.getId(), saved.getName(), saved.getSku());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            log.warn("Create product rejected by unique constraint: sku={}", request.sku());
            throw new ResourceExistsException("Product with sku " + request.sku() + " taken", e);
        }
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        log.info("Update product: id={}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        String sku = normalizeSku(request.sku());
        if (productRepository.existsBySku(sku) && !product.getSku().equals(sku)) {
            throw new ResourceExistsException("Product with sku " + request.sku() + " taken");
        }

        product.setName(normalizeName(request.name()));
        product.setSku(sku);
        product.setDescription(normalizeDescription(request.description()));
        product.setImageUrl(normalizeImageUrl(request.imageUrl()));
        product.setPrice(request.price());
        product.setQuantity(request.quantity());
        product.setActive(request.active());

        if (request.categoryId() != null) {
            ProductCategory category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + request.categoryId()));
            product.setProductCategory(category);
        } else {
            product.setProductCategory(null);
        }

        if (request.typeId() != null) {
            ProductType type = typeRepository.findById(request.typeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + request.typeId()));
            product.setProductType(type);
        } else {
            product.setProductType(null);
        }

        try {
            Product saved = productRepository.save(product);
            log.info("Product updated: id={}, name={}, sku={}", saved.getId(), saved.getName(), saved.getSku());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            log.warn("Update product rejected by unique constraint: id={}, sku={}", id, request.sku());
            throw new ResourceExistsException("Product with sku " + request.sku() + " taken", e);
        }
    }

    @Override
    public void deleteProduct(Long id) {
        log.info("Delete product: id={}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        try {
            productRepository.delete(product);
        } catch (DataIntegrityViolationException e) {
            log.warn("Delete product rejected by constraint violation: id={}", id);
            throw new ResourceExistsException("Product cannot be deleted due to existing references", e);
        }

        log.info("Product deleted: id={}", id);
    }
}