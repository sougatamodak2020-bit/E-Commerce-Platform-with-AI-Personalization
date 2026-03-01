package com.ecommerce.productservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = \"products\", indexes = {
    @Index(name = \"idx_product_slug\", columnList = \"slug\"),
    @Index(name = \"idx_product_category\", columnList = \"category_id\"),
    @Index(name = \"idx_product_seller\", columnList = \"seller_id\")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private UUID sellerId;

    @Column(nullable = false)
    private UUID categoryId;

    @Column(nullable = false, length = 500)
    private String name;

    @Column(unique = true, nullable = false, length = 500)
    private String slug;

    @Column(columnDefinition = \"TEXT\", nullable = false)
    private String description;

    @Column(length = 1000)
    private String shortDescription;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(length = 100, unique = true)
    private String sku;

    @Column(columnDefinition = \"boolean default true\")
    private Boolean trackInventory = true;

    @Column(columnDefinition = \"integer default 0\")
    private Integer inventoryQuantity = 0;

    @Column(columnDefinition = \"boolean default true\")
    private Boolean isActive = true;

    @Column(columnDefinition = \"boolean default false\")
    private Boolean isFeatured = false;

    @Column(precision = 3, scale = 2, columnDefinition = \"decimal(3,2) default 0.00\")
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(columnDefinition = \"integer default 0\")
    private Integer reviewCount = 0;

    @Column(columnDefinition = \"integer default 0\")
    private Integer viewCount = 0;

    @Column(columnDefinition = \"integer default 0\")
    private Integer saleCount = 0;

    @Column(columnDefinition = \"TEXT\")
    private String primaryImageUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Transient
    public boolean isInStock() {
        return !trackInventory || inventoryQuantity > 0;
    }

    @Transient
    public BigDecimal getDiscountPercentage() {
        if (compareAtPrice != null && compareAtPrice.compareTo(price) > 0) {
            BigDecimal discount = compareAtPrice.subtract(price);
            return discount.divide(compareAtPrice, 2, BigDecimal.ROUND_HALF_UP)
                          .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }
}
