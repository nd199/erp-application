package com.naren.erpbackend.inventory.dto;

import com.naren.erpbackend.inventory.entity.ProductType;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class ProductTypeResponseMapper implements Function<ProductType, ProductTypeResponse> {

    @Override
    public ProductTypeResponse apply(ProductType type) {
        return new ProductTypeResponse(
                type.getId(),
                type.getName(),
                type.getDescription(),
                type.isActive(),
                type.getVersion(),
                type.getCreatedAt(),
                type.getLastUpdated()
        );
    }
}
