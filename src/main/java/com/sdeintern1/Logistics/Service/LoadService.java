package com.sdeintern1.Logistics.Service;

import com.sdeintern1.Logistics.DTO.LoadRequestDTO;
import com.sdeintern1.Logistics.DTO.LoadResponseDTO;
import com.sdeintern1.Logistics.Entity.Load;
import com.sdeintern1.Logistics.Mapper.LoadMapper;
import com.sdeintern1.Logistics.Repository.LoadRepository;
import com.sdeintern1.Logistics.Specification.LoadSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoadService {

    private final LoadRepository loadRepository;
    private final LoadMapper loadMapper;

    @CacheEvict(value = "loads", allEntries = true)
    public LoadResponseDTO saveEntry(LoadRequestDTO requestDTO) {
        log.debug("Saving new load entry for shipper: {}", requestDTO.getShipperId());
        Load load = loadMapper.toEntity(requestDTO);
        Load savedLoad = loadRepository.save(load);
        return loadMapper.toResponseDTO(savedLoad);
    }

    @Cacheable(value = "loads", key = "#shipperId + '-' + #productType + '-' + #truckType")
    public List<LoadResponseDTO> getByFilter(String shipperId, String productType, String truckType) {
        log.debug("Fetching loads with filter - Shipper: {}, Product: {}, Truck: {}", shipperId, productType, truckType);
        Specification<Load> spec = Specification.where(LoadSpecification.hasShipperId(shipperId))
                .and(LoadSpecification.hasProductType(productType))
                .and(LoadSpecification.hasTruckType(truckType));

        return loadRepository.findAll(spec).stream()
                .map(loadMapper::toResponseDTO)
                .toList();
    }

    @Cacheable(value = "loads", key = "#id")
    public LoadResponseDTO getById(UUID id) {
        log.debug("Fetching load by ID: {}", id);
        return loadRepository.findById(id)
                .map(loadMapper::toResponseDTO)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));
    }

    @CacheEvict(value = "loads", key = "#id")
    public void deleteById(UUID id) {
        log.debug("Soft deleting load with ID: {}", id);
        if (!loadRepository.existsById(id)) {
            throw new RuntimeException("Load not found with ID: " + id);
        }
        loadRepository.deleteById(id);
    }

    @CachePut(value = "loads", key = "#id")
    public LoadResponseDTO update(UUID id, LoadRequestDTO requestDTO) {
        log.debug("Updating load with ID: {}", id);
        Load existingLoad = loadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Load not found with ID: " + id));

        loadMapper.updateEntityFromDTO(requestDTO, existingLoad);
        Load updatedLoad = loadRepository.save(existingLoad);
        return loadMapper.toResponseDTO(updatedLoad);
    }
}
