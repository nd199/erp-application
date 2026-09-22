package com.naren.erpbackend.purchase.dto;

import com.naren.erpbackend.purchase.entity.Supplier;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class SupplierResponseMapper implements Function<Supplier, SupplierResponse> {

    @Override
    public SupplierResponse apply(Supplier supplier) {
        return new SupplierResponse(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactPerson(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress(),
                supplier.getGstNumber(),
                supplier.isActive(),
                supplier.getVersion(),
                supplier.getCreatedAt(),
                supplier.getLastUpdated()
        );
    }
}
