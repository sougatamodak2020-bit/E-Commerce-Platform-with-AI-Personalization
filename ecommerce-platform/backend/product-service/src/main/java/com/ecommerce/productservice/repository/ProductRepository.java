package com.ecommerce.productservice.repository;

import com.ecommerce.productservice.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    
    Optional<Product> findBySlug(String slug);
    
    Page<Product> findByIsActiveTrue(Pageable pageable);
    
    Page<Product> findByIsFeaturedTrueAndIsActiveTrue(Pageable pageable);
    
    Page<Product> findByCategoryIdAndIsActiveTrue(UUID categoryId, Pageable pageable);
    
    Page<Product> findBySellerIdAndIsActiveTrue(UUID sellerId, Pageable pageable);
    
    @Query(\"SELECT p FROM Product p WHERE p.isActive = true AND \" +
           \"LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR \" +
           \"LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))\")
    Page<Product> searchProducts(@Param(\"query\") String query, Pageable pageable);
    
    @Query(\"SELECT p FROM Product p WHERE p.isActive = true AND \" +
           \"p.price BETWEEN :minPrice AND :maxPrice\")
    Page<Product> findByPriceRange(@Param(\"minPrice\") BigDecimal minPrice, 
                                    @Param(\"maxPrice\") BigDecimal maxPrice, 
                                    Pageable pageable);
    
    @Query(\"SELECT p FROM Product p WHERE p.isActive = true AND p.rating >= :minRating\")
    Page<Product> findByMinRating(@Param(\"minRating\") BigDecimal minRating, Pageable pageable);
    
    List<Product> findTop10ByIsActiveTrueOrderBySaleCountDesc();
    
    List<Product> findTop10ByIsActiveTrueOrderByCreatedAtDesc();
}
