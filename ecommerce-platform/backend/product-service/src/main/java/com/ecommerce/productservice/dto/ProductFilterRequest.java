package com.ecommerce.productservice.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductFilterRequest {
    private UUID categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal minRating;
    private String sortBy = \"createdAt\";
    private String sortOrder = \"desc\";
}
