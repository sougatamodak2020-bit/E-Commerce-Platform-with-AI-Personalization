package com.ecommerce.productservice.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class ProductResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal compareAtPrice;
    private BigDecimal discountPercentage;
    private String primaryImageUrl;
    private BigDecimal rating;
    private Integer reviewCount;
    private Boolean inStock;
    private Integer inventoryQuantity;
}
