package com.sdeintern1.Logistics.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;


import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "loads")
public class Load {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;
    @NotBlank(message = "Shipper ID cannot be empty")
    private String shipperId;

    @NotBlank(message = "Product Type is required")
    private String productType;

    @NotBlank(message = "Truck Type is required")
    private String truckType;

    @Min(value = 1, message = "At least 1 truck is required")

    private int noOfTrucks;

@Positive(message = "weight should be positive")
private double weight;
    private String comment;
    @CreationTimestamp
    private Timestamp datePosted;

    @Embedded
    private Facility facility;

    @Getter
    @Enumerated(EnumType.STRING)
    @Setter
    private Status status = Status.POSTED;

    public enum Status {
        POSTED, BOOKED, CANCELLED
    }

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Facility {
        @NotBlank(message = "Load Point is required")
        private String loadPoint;

        @NotBlank(message = "Unloading Point is required")
        private String unloadingPoint;

        @FutureOrPresent(message = "Loading date must be in the future or present cannot be past")
        private LocalDateTime loadingDate;

        @FutureOrPresent(message = "Unloading date must be in the future or present")
        private LocalDateTime unloadingDate;
    }
}
