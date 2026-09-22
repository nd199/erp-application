package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.common.exception.ResourceExistsException;
import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.inventory.dto.ProductTypeRequest;
import com.naren.erpbackend.inventory.dto.ProductTypeResponse;
import com.naren.erpbackend.inventory.dto.ProductTypeResponseMapper;
import com.naren.erpbackend.inventory.entity.ProductType;
import com.naren.erpbackend.inventory.repository.ProductTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductTypeMServiceImpl implements ProductTypeMService {

    private final ProductTypeRepository typeRepository;
    private final ProductTypeResponseMapper responseMapper;

    @Override
    public ProductTypeResponse createType(ProductTypeRequest request) {
        log.info("Create type: name={}", request.name());

        if (typeRepository.existsByNameIgnoreCase(request.name())) {
            throw new ResourceExistsException("Type '" + request.name() + "' already exists");
        }

        try {
            ProductType type = ProductType.builder()
                    .name(request.name())
                    .description(request.description())
                    .active(true)
                    .build();
            ProductType saved = typeRepository.save(type);
            log.info("Type created: id={}, name={}", saved.getId(), saved.getName());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Type '" + request.name() + "' already exists", e);
        }
    }

    @Override
    public ProductTypeResponse updateType(Long id, ProductTypeRequest request) {
        log.info("Update type: id={}", id);

        ProductType type = typeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + id));

        if (!type.getName().equalsIgnoreCase(request.name())
                && typeRepository.existsByNameIgnoreCase(request.name())) {
            throw new ResourceExistsException("Type '" + request.name() + "' already exists");
        }

        type.setName(request.name());
        type.setDescription(request.description());
        type.setLastUpdated(Instant.now());

        try {
            ProductType saved = typeRepository.save(type);
            log.info("Type updated: id={}, name={}", saved.getId(), saved.getName());
            return responseMapper.apply(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Type '" + request.name() + "' already exists", e);
        }
    }

    @Override
    public void deleteType(Long id) {
        log.info("Delete type: id={}", id);

        ProductType type = typeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + id));

        try {
            typeRepository.delete(type);
        } catch (DataIntegrityViolationException e) {
            throw new ResourceExistsException("Type cannot be deleted due to existing references", e);
        }

        log.info("Type deleted: id={}", id);
    }
}
