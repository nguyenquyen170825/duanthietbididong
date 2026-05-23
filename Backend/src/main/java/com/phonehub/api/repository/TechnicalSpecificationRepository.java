package com.phonehub.api.repository;

import com.phonehub.api.model.TechnicalSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicalSpecificationRepository extends JpaRepository<TechnicalSpecification, Long> {
    List<TechnicalSpecification> findByProductId(Long productId);
}
