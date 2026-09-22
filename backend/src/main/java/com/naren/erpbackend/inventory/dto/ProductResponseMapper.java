package com.naren.erpbackend.inventory.dto;

import com.naren.erpbackend.inventory.entity.Product;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class ProductResponseMapper implements Function<Product, ProductResponse> {

    @Override
    public ProductResponse apply(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getDescription(),
                product.getImageUrl(),
                product.getPrice(),
                product.getQuantity(),
                product.isActive(),
                product.getProductCategory() != null ? product.getProductCategory().getId() : null,
                product.getProductCategory() != null ? product.getProductCategory().getName() : null,
                product.getProductType() != null ? product.getProductType().getId() : null,
                product.getProductType() != null ? product.getProductType().getName() : null,
                product.getVersion(),
                product.getCreatedAt(),
                product.getLastUpdated()
        );
    }
}
