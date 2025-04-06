package com.sdeintern1.Logistics.Specification;

import com.sdeintern1.Logistics.Entity.Booking;
import org.springframework.data.jpa.domain.Specification;

public class BookingSpecification {
    public static Specification<Booking> hastransporterId(String transporterId) {
        return (root, query, criteriaBuilder) ->
                transporterId == null ? null : criteriaBuilder.equal(root.get("transporterId"), transporterId);
    }

    public static Specification<Booking> hasproposedRate(Double proposedRate) {
        return (root, query, criteriaBuilder) ->
                proposedRate == null ? null : criteriaBuilder.equal(root.get("proposedRate"), proposedRate);
    }


}
