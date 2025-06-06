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
import java.util.List;

@Service
@Transactional
public class ProductService {
    private final ProductRepository productRepository;
    private static final int MIN_QUANTITY = 0;
    private static final BigDecimal MIN_PRICE = BigDecimal.ZERO;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public Product createProduct(Product product) {
        validateProduct(product);
        checkDuplicateSku(product.getSku());
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product product) {
        validateProduct(product);
        Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        if (!existingProduct.getSku().equals(product.getSku())) {
            checkDuplicateSku(product.getSku());
        }
        
        existingProduct.setName(product.getName());
        existingProduct.setSku(product.getSku());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setCategory(product.getCategory());
        
        return productRepository.save(existingProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
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

    private void validateProduct(Product product) {
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        if (!StringUtils.hasText(product.getName())) {
            throw new IllegalArgumentException("Product name cannot be empty");
        }
        if (!StringUtils.hasText(product.getSku())) {
            throw new IllegalArgumentException("Product SKU cannot be empty");
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