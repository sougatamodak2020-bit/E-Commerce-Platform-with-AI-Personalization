package com.ecommerce.productservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ProductRequest {
    @NotNull
    private UUID categoryId;

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    private String shortDescription;

    @NotNull
    @Positive
    private BigDecimal price;

    private BigDecimal compareAtPrice;

    private String sku;

    private Integer inventoryQuantity = 0;

    private String primaryImageUrl;
}
