package com.sdeintern1.Logistics.Controller;

import com.sdeintern1.Logistics.DTO.BookingRequestDTO;
import com.sdeintern1.Logistics.DTO.BookingResponseDTO;
import com.sdeintern1.Logistics.Service.BookingService;
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
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Booking Management", description = "Endpoints for managing bookings")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking for a load")
    public ResponseEntity<BookingResponseDTO> create(@Valid @RequestBody BookingRequestDTO requestDTO) {
        log.info("REST request to create Booking: {}", requestDTO);
        BookingResponseDTO response = bookingService.createEntry(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get bookings by filters")
    public ResponseEntity<List<BookingResponseDTO>> getAll(
            @RequestParam(required = false) String transporterId,
            @RequestParam(required = false) Double proposedRate
    ) {
        log.info("REST request to get Bookings by filter - Transporter: {}, Rate: {}", transporterId, proposedRate);
        List<BookingResponseDTO> list = bookingService.getAll(transporterId, proposedRate);
        if (list.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a booking by ID")
    public ResponseEntity<BookingResponseDTO> getById(@PathVariable UUID id) {
        log.info("REST request to get Booking: {}", id);
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a booking by ID")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        log.info("REST request to delete Booking: {}", id);
        bookingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing booking")
    public ResponseEntity<BookingResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody BookingRequestDTO requestDTO) {
        log.info("REST request to update Booking: {}, payload: {}", id, requestDTO);
        return ResponseEntity.ok(bookingService.update(id, requestDTO));
    }
}
