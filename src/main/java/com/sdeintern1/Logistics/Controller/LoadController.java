package com.sdeintern1.Logistics.Controller;

import com.sdeintern1.Logistics.DTO.LoadRequestDTO;
import com.sdeintern1.Logistics.DTO.LoadResponseDTO;
import com.sdeintern1.Logistics.Service.LoadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/loads")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Load Management", description = "Endpoints for managing loads")
public class LoadController {

    private final LoadService loadService;

    @PostMapping
    @Operation(summary = "Create a new load")
    public ResponseEntity<LoadResponseDTO> create(@Valid @RequestBody LoadRequestDTO requestDTO) {
        log.info("REST request to create Load: {}", requestDTO);
        LoadResponseDTO response = loadService.saveEntry(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get loads by filters")
    public ResponseEntity<List<LoadResponseDTO>> getByFilter(
            @RequestParam(required = false) String shipperId,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) String truckType
    ) {
        log.info("REST request to get Loads by filter - Shipper: {}, Product: {}, Truck: {}", shipperId, productType, truckType);
        List<LoadResponseDTO> list = loadService.getByFilter(shipperId, productType, truckType);
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{loadId}")
    @Operation(summary = "Get a load by ID")
    public ResponseEntity<LoadResponseDTO> getById(@PathVariable UUID loadId) {
        log.info("REST request to get Load: {}", loadId);
        return ResponseEntity.ok(loadService.getById(loadId));
    }

    @DeleteMapping("/{loadId}")
    @Operation(summary = "Delete a load by ID (Soft Delete)")
    public ResponseEntity<Void> deleteById(@PathVariable UUID loadId) {
        log.info("REST request to delete Load: {}", loadId);
        loadService.deleteById(loadId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{loadId}")
    @Operation(summary = "Update an existing load")
    public ResponseEntity<LoadResponseDTO> update(@PathVariable UUID loadId, @Valid @RequestBody LoadRequestDTO requestDTO) {
        log.info("REST request to update Load: {}, payload: {}", loadId, requestDTO);
        return ResponseEntity.ok(loadService.update(loadId, requestDTO));
    }
}
