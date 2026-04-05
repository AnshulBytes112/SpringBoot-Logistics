package com.sdeintern1.Logistics.Entity;

import jakarta.persistence.*;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "booking")
@SQLDelete(sql = "UPDATE booking SET deleted = true WHERE id=?")
@Where(clause = "deleted=false")
public class Booking extends Auditable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;


    @NotNull(message = "Load ID cannot be null")
    private UUID loadId;
    @NotBlank
    private String transporterId;

    @Positive(message = "Proposed Rate should be positive")
    private Double proposedRate;

    private String comment;

    private boolean deleted = false;

    @Enumerated(EnumType.STRING)
    @Getter
    @Setter
    private Status status= Status.PENDING;


    public enum Status {
        PENDING,ACCEPTED,REJECTED
    }
}
