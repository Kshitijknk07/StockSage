package com.inventory.repository;

import com.inventory.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    boolean existsByName(String name);

    List<Category> findByNameContainingIgnoreCase(String name);

    @SuppressWarnings("null")
    @Override
    Page<Category> findAll(Pageable pageable);

    Page<Category> findByNameContainingIgnoreCase(String name, Pageable pageable);

    @Query("SELECT c, COUNT(p) as productCount FROM Category c LEFT JOIN c.products p GROUP BY c")
    Page<Object[]> findAllWithProductCount(Pageable pageable);

    @Query("SELECT DISTINCT c FROM Category c JOIN c.products p WHERE p.quantity < :threshold")
    List<Category> findCategoriesWithLowStock(@Param("threshold") int threshold);

    @Query("SELECT DISTINCT c FROM Category c JOIN c.products p WHERE p.quantity < :threshold")
    Page<Category> findCategoriesWithLowStock(@Param("threshold") int threshold, Pageable pageable);

    @Query("SELECT c FROM Category c LEFT JOIN c.products p WHERE p IS NULL")
    List<Category> findEmptyCategories();

    @Query("SELECT c FROM Category c LEFT JOIN c.products p WHERE p IS NULL")
    Page<Category> findEmptyCategories(Pageable pageable);

    @Query("SELECT c FROM Category c WHERE (SELECT COUNT(p) FROM c.products p) BETWEEN :minCount AND :maxCount")
    Page<Category> findByProductCountRange(
            @Param("minCount") int minCount,
            @Param("maxCount") int maxCount,
            Pageable pageable);

    // New query methods
    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Category> searchCategories(@Param("keyword") String keyword);

    @Query("SELECT c FROM Category c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    Page<Category> searchCategories(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT c FROM Category c WHERE (SELECT COUNT(p) FROM c.products p) > :count")
    List<Category> findCategoriesWithMoreThanProducts(@Param("count") int count);

    @Query("SELECT c FROM Category c WHERE (SELECT COUNT(p) FROM c.products p) < :count")
    List<Category> findCategoriesWithLessThanProducts(@Param("count") int count);

    @Query("SELECT c FROM Category c WHERE (SELECT COUNT(p) FROM c.products p WHERE p.quantity = 0) > 0")
    List<Category> findCategoriesWithOutOfStockProducts();

    @Query("SELECT c FROM Category c WHERE (SELECT COUNT(p) FROM c.products p WHERE p.quantity > 0) > 0")
    List<Category> findCategoriesWithInStockProducts();

    @Query("SELECT c FROM Category c ORDER BY (SELECT COUNT(p) FROM c.products p) DESC")
    List<Category> findCategoriesOrderByProductCountDesc();

    @Query("SELECT c FROM Category c ORDER BY (SELECT COUNT(p) FROM c.products p) ASC")
    List<Category> findCategoriesOrderByProductCountAsc();
}
