package com.inventory.repository;

import com.inventory.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

        boolean existsBySku(String sku);

        List<Product> findByCategory_NameContainingIgnoreCase(String categoryName);

        List<Product> findByQuantityLessThan(int threshold);

        @Query("SELECT p FROM Product p WHERE " +
                        "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        List<Product> search(@Param("keyword") String keyword);

        @SuppressWarnings("null")
        @Override
        Page<Product> findAll(Pageable pageable);

        Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);

        @Query("SELECT p FROM Product p WHERE " +
                        "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.sku) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                        "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
        Page<Product> searchWithPagination(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
        Page<Product> findByPriceRange(
                        @Param("minPrice") Double minPrice,
                        @Param("maxPrice") Double maxPrice,
                        Pageable pageable);

        Page<Product> findByQuantityLessThan(int threshold, Pageable pageable);

        Page<Product> findByCategory_Name(String categoryName, Pageable pageable);

        @Query("SELECT p FROM Product p WHERE p.category.id IN :categoryIds")
        Page<Product> findByCategoryIds(@Param("categoryIds") List<Long> categoryIds, Pageable pageable);
}