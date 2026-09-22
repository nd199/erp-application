package com.naren.erpbackend.inventory.service;

import com.naren.erpbackend.common.exception.ResourceNotFoundException;
import com.naren.erpbackend.inventory.dto.ProductTypeResponse;
import com.naren.erpbackend.inventory.dto.ProductTypeResponseMapper;
import com.naren.erpbackend.inventory.entity.ProductType;
import com.naren.erpbackend.inventory.repository.ProductTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductTypeQServiceImpl implements ProductTypeQService {

    private final ProductTypeRepository typeRepository;
    private final ProductTypeResponseMapper responseMapper;

    @Override
    public ProductTypeResponse findTypeById(Long id) {
        log.info("Fetch type: id={}", id);
        ProductType type = typeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type not found: " + id));
        return responseMapper.apply(type);
    }

    @Override
    public Page<ProductTypeResponse> findAllTypes(Pageable pageable) {
        log.info("Fetch all types: pageable={}", pageable);
        return typeRepository.findAll(pageable).map(responseMapper);
    }

    @Override
    public Page<ProductTypeResponse> searchTypes(String keyword, Pageable pageable) {
        log.info("Search types: keyword={}", keyword);
        return typeRepository.searchTypes(keyword, pageable).map(responseMapper);
    }
}
