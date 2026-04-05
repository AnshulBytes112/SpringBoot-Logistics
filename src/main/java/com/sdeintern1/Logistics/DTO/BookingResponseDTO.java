package com.sdeintern1.Logistics.DTO;

import com.sdeintern1.Logistics.Entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private UUID id;
    private UUID loadId;
    private String transporterId;
    private Double proposedRate;
    private String comment;
    private Booking.Status status;
    private String createdBy;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}
