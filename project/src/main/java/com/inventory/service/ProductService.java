package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private static final int MIN_QUANTITY = 0;
    private static final BigDecimal MIN_PRICE = BigDecimal.ZERO;
    private static final int MAX_NAME_LENGTH = 100;
    private static final int MAX_SKU_LENGTH = 20;
    private static final int MAX_DESCRIPTION_LENGTH = 500;
    private static final int LOW_STOCK_THRESHOLD = 10;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Transactional
    public Product createProduct(Product product) {
        validateProduct(product);
        checkDuplicateSku(product.getSku());
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (!product.getSku().equals(productDetails.getSku())) {
            checkDuplicateSku(productDetails.getSku());
        }
        
        validateProduct(productDetails);
        product.setName(productDetails.getName());
        product.setSku(productDetails.getSku());
        product.setDescription(productDetails.getDescription());
        product.setQuantity(productDetails.getQuantity());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setUpdatedAt(LocalDateTime.now());
        
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public Product getProduct(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        if (!StringUtils.hasText(keyword)) {
            throw new IllegalArgumentException("Search keyword cannot be empty");
        }
        return productRepository.searchWithPagination(keyword, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Product> searchProductsByCategory(String categoryName, Pageable pageable) {
        if (!StringUtils.hasText(categoryName)) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        return productRepository.findByCategory_Name(categoryName, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Product> getLowStockProducts(int threshold, Pageable pageable) {
        if (threshold < 0) {
            throw new IllegalArgumentException("Threshold cannot be negative");
        }
        return productRepository.findByQuantityLessThan(threshold, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsByPriceRange(Double minPrice, Double maxPrice, Pageable pageable) {
        if (minPrice == null || maxPrice == null) {
            throw new IllegalArgumentException("Price range cannot be null");
        }
        if (minPrice < 0 || maxPrice < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        if (minPrice > maxPrice) {
            throw new IllegalArgumentException("Minimum price cannot be greater than maximum price");
        }
        return productRepository.findByPriceRange(minPrice, maxPrice, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategories(List<Long> categoryIds, Pageable pageable) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            throw new IllegalArgumentException("Category IDs cannot be null or empty");
        }
        return productRepository.findByCategoryIds(categoryIds, pageable);
    }

    @Transactional(readOnly = true)
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts(LOW_STOCK_THRESHOLD);
    }

    @Transactional(readOnly = true)
    public List<Product> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts();
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsWithoutCategory() {
        return productRepository.findProductsWithoutCategory();
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsCreatedBetween(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        return productRepository.findProductsCreatedBetween(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsAbovePrice(BigDecimal price) {
        if (price == null || price.compareTo(MIN_PRICE) < 0) {
            throw new IllegalArgumentException("Price must be greater than or equal to zero");
        }
        return productRepository.findProductsAbovePrice(price);
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsBelowPrice(BigDecimal price) {
        if (price == null || price.compareTo(MIN_PRICE) < 0) {
            throw new IllegalArgumentException("Price must be greater than or equal to zero");
        }
        return productRepository.findProductsBelowPrice(price);
    }

    private void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        if (!StringUtils.hasText(product.getName())) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (product.getName().length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("Product name cannot be longer than " + MAX_NAME_LENGTH + " characters");
        }
        if (!StringUtils.hasText(product.getSku())) {
            throw new IllegalArgumentException("Product SKU cannot be empty");
        }
        if (product.getSku().length() > MAX_SKU_LENGTH) {
            throw new IllegalArgumentException("Product SKU cannot be longer than " + MAX_SKU_LENGTH + " characters");
        }
        if (product.getDescription() != null && product.getDescription().length() > MAX_DESCRIPTION_LENGTH) {
            throw new IllegalArgumentException("Product description cannot be longer than " + MAX_DESCRIPTION_LENGTH + " characters");
        }
        if (product.getQuantity() < MIN_QUANTITY) {
            throw new IllegalArgumentException("Product quantity cannot be negative");
        }
        if (product.getPrice() == null || product.getPrice().compareTo(MIN_PRICE) < 0) {
            throw new IllegalArgumentException("Product price must be greater than or equal to zero");
        }
    }

    private void checkDuplicateSku(String sku) {
        if (productRepository.existsBySku(sku)) {
            throw new RuntimeException("Product with SKU " + sku + " already exists");
        }
    }
}