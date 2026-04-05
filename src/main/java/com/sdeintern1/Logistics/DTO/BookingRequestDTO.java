package com.sdeintern1.Logistics.DTO;

import com.sdeintern1.Logistics.Entity.Booking;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {
    @NotNull(message = "Load ID cannot be null")
    private UUID loadId;

    @NotBlank(message = "Transporter ID cannot be empty")
    private String transporterId;

    @Positive(message = "Proposed Rate should be positive")
    private Double proposedRate;

    private String comment;

    private Booking.Status status;
}
