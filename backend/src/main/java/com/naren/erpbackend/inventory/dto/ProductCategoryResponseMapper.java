package com.naren.erpbackend.inventory.dto;

import com.naren.erpbackend.inventory.entity.ProductCategory;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class ProductCategoryResponseMapper implements Function<ProductCategory, ProductCategoryResponse> {

    @Override
    public ProductCategoryResponse apply(ProductCategory category) {
        return new ProductCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.isActive(),
                category.getVersion(),
                category.getCreatedAt(),
                category.getLastUpdated()
        );
    }
}
