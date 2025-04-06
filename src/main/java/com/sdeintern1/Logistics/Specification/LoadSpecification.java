package com.sdeintern1.Logistics.Specification;

import com.sdeintern1.Logistics.Entity.Load;
import org.springframework.data.jpa.domain.Specification;

public class LoadSpecification {

    public static Specification<Load> hasShipperId(String shipperId) {
        return (root, query, criteriaBuilder) ->
                shipperId == null ? null : criteriaBuilder.equal(root.get("shipperId"), shipperId);
    }

    public static Specification<Load> hasProductType(String productType) {
        return (root, query, criteriaBuilder) ->
                productType == null ? null : criteriaBuilder.equal(root.get("productType"), productType);
    }

    public static Specification<Load> hasTruckType(String truckType) {
        return (root, query, criteriaBuilder) ->
                truckType == null ? null : criteriaBuilder.equal(root.get("truckType"), truckType);
    }
}
