package com.sdeintern1.Logistics.DTO;

import com.sdeintern1.Logistics.Entity.Load;
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
public class LoadResponseDTO {
    private UUID id;
    private String shipperId;
    private String productType;
    private String truckType;
    private int noOfTrucks;
    private double weight;
    private String comment;
    private FacilityDTO facility;
    private Load.Status status;
    private String createdBy;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FacilityDTO {
        private String loadPoint;
        private String unloadingPoint;
        private LocalDateTime loadingDate;
        private LocalDateTime unloadingDate;
    }
}
