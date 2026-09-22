package com.naren.erpbackend.purchase.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.purchase.dto.SupplierRequest;
import com.naren.erpbackend.purchase.dto.SupplierResponse;
import com.naren.erpbackend.purchase.dto.SupplierResponseMapper;
import com.naren.erpbackend.purchase.entity.Supplier;
import com.naren.erpbackend.purchase.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupplierMServiceImpl implements SupplierMService {

    private final SupplierRepository supplierRepository;
    private final SupplierResponseMapper responseMapper;

    @Override
    public SupplierResponse createSupplier(SupplierRequest request) {
        log.info("Create supplier: name={}", request.name());

        if (supplierRepository.existsByNameIgnoreCase(request.name())) {
            throw new ResourceExistsException("Supplier with name '" + request.name() + "' already exists");
        }

        Supplier supplier = Supplier.builder()
                .name(request.name())
                .contactPerson(request.contactPerson())
                .email(request.email())
                .phone(request.phone())
                .address(request.address())
                .gstNumber(request.gstNumber())
                .active(true)
                .build();

        supplierRepository.save(supplier);
        return responseMapper.apply(supplier);
    }

    @Override
    public SupplierResponse updateSupplier(Long id, SupplierRequest request) {
        log.info("Update supplier: id={}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found: " + id));

        if (!Objects.equals(supplier.getName(), request.name())
                && supplierRepository.existsByNameIgnoreCase(request.name())) {
            throw new ResourceExistsException("Supplier with name '" + request.name() + "' already exists");
        }

        supplier.setName(request.name());
        supplier.setContactPerson(request.contactPerson());
        supplier.setEmail(request.email());
        supplier.setPhone(request.phone());
        supplier.setAddress(request.address());
        supplier.setGstNumber(request.gstNumber());
        supplier.setLastUpdated(Instant.now());

        supplierRepository.save(supplier);
        return responseMapper.apply(supplier);
    }

    @Override
    public void deleteSupplier(Long id) {
        log.info("Delete supplier: id={}", id);

        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found: " + id));

        supplierRepository.delete(supplier);
    }
}
