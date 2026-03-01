package com.ecommerce.productservice.service;

import com.ecommerce.productservice.dto.ProductRequest;
import com.ecommerce.productservice.dto.ProductResponse;
import com.ecommerce.productservice.dto.ProductFilterRequest;
import com.ecommerce.productservice.model.Product;
import com.ecommerce.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Cacheable(value = \"products\", key = \"#pageable.pageNumber + '-' + #pageable.pageSize\")
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable)
                .map(this::mapToResponse);
    }

    @Cacheable(value = \"product\", key = \"#slug\")
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException(\"Product not found\"));
        
        // Increment view count
        product.setViewCount(product.getViewCount() + 1);
        productRepository.save(product);
        
        return mapToResponse(product);
    }

    @Cacheable(value = \"featuredProducts\")
    public List<ProductResponse> getFeaturedProducts() {
        Pageable pageable = PageRequest.of(0, 12, Sort.by(\"rating\").descending());
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue(pageable)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return productRepository.searchProducts(query, pageable)
                .map(this::mapToResponse);
    }

    public Page<ProductResponse> filterProducts(ProductFilterRequest filter, Pageable pageable) {
        // Complex filtering logic
        if (filter.getCategoryId() != null) {
            return productRepository.findByCategoryIdAndIsActiveTrue(filter.getCategoryId(), pageable)
                    .map(this::mapToResponse);
        }
        
        if (filter.getMinPrice() != null && filter.getMaxPrice() != null) {
            return productRepository.findByPriceRange(filter.getMinPrice(), filter.getMaxPrice(), pageable)
                    .map(this::mapToResponse);
        }
        
        return getAllProducts(pageable);
    }

    @Transactional
    @CacheEvict(value = {\"products\", \"featuredProducts\"}, allEntries = true)
    public ProductResponse createProduct(ProductRequest request, UUID sellerId) {
        Product product = Product.builder()
                .sellerId(sellerId)
                .categoryId(request.getCategoryId())
                .name(request.getName())
                .slug(generateSlug(request.getName()))
                .description(request.getDescription())
                .shortDescription(request.getShortDescription())
                .price(request.getPrice())
                .compareAtPrice(request.getCompareAtPrice())
                .sku(request.getSku())
                .inventoryQuantity(request.getInventoryQuantity())
                .primaryImageUrl(request.getPrimaryImageUrl())
                .isActive(true)
                .isFeatured(false)
                .build();

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    @CacheEvict(value = {\"products\", \"product\", \"featuredProducts\"}, allEntries = true)
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(\"Product not found\"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setInventoryQuantity(request.getInventoryQuantity());

        product = productRepository.save(product);
        return mapToResponse(product);
    }

    @Transactional
    @CacheEvict(value = {\"products\", \"product\"}, allEntries = true)
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(\"Product not found\"));
        product.setIsActive(false);
        productRepository.save(product);
    }

    public List<ProductResponse> getBestSellers() {
        return productRepository.findTop10ByIsActiveTrueOrderBySaleCountDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getNewArrivals() {
        return productRepository.findTop10ByIsActiveTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .shortDescription(product.getShortDescription())
                .price(product.getPrice())
                .compareAtPrice(product.getCompareAtPrice())
                .discountPercentage(product.getDiscountPercentage())
                .primaryImageUrl(product.getPrimaryImageUrl())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .inStock(product.isInStock())
                .inventoryQuantity(product.getInventoryQuantity())
                .build();
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll(\"[^a-z0-9\\\\s-]\", \"\")
                .replaceAll(\"\\\\s+\", \"-\")
                .replaceAll(\"-+\", \"-\")
                + \"-\" + UUID.randomUUID().toString().substring(0, 8);
    }
}
