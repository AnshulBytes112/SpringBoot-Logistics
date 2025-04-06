package com.sdeintern1.Logistics.Repository;

import com.sdeintern1.Logistics.Entity.Load;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface LoadRepository extends JpaRepository<Load, UUID>, JpaSpecificationExecutor<Load> {



}

