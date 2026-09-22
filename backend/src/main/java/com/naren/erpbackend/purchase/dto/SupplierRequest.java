package com.naren.erpbackend.purchase.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupplierRequest(

        @NotBlank(message = "Supplier name is required")
        @Size(max = 150, message = "Name must not exceed 150 characters")
        String name,

        @Size(max = 100, message = "Contact person must not exceed 100 characters")
        String contactPerson,

        @Size(max = 254, message = "Email must not exceed 254 characters")
        String email,

        @Size(max = 20, message = "Phone must not exceed 20 characters")
        String phone,

        String address,

        @Size(max = 20, message = "GST number must not exceed 20 characters")
        String gstNumber
) {
}
