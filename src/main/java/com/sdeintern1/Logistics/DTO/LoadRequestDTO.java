package com.sdeintern1.Logistics.DTO;

import com.sdeintern1.Logistics.Entity.Load;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoadRequestDTO {
    @NotBlank(message = "Shipper ID cannot be empty")
    private String shipperId;

    @NotBlank(message = "Product Type is required")
    private String productType;

    @NotBlank(message = "Truck Type is required")
    private String truckType;

    @Min(value = 1, message = "At least 1 truck is required")
    private int noOfTrucks;

    @Positive(message = "Weight should be positive")
    private double weight;

    private String comment;

    private FacilityDTO facility;

    private Load.Status status;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FacilityDTO {
        @NotBlank(message = "Load Point is required")
        private String loadPoint;

        @NotBlank(message = "Unloading Point is required")
        private String unloadingPoint;

        @FutureOrPresent(message = "Loading date must be in the future or present")
        private LocalDateTime loadingDate;

        @FutureOrPresent(message = "Unloading date must be in the future or present")
        private LocalDateTime unloadingDate;
    }
}
