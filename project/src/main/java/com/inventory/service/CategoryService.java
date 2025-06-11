package com.inventory.service;

import com.inventory.model.Category;
import com.inventory.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private static final int MAX_NAME_LENGTH = 100;
    private static final int MAX_DESCRIPTION_LENGTH = 500;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        validateCategory(category);
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with name '" + category.getName() + "' already exists");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        validateCategory(categoryDetails);
        if (!category.getName().equals(categoryDetails.getName()) && 
            categoryRepository.existsByName(categoryDetails.getName())) {
            throw new RuntimeException("Category with name '" + categoryDetails.getName() + "' already exists");
        }
        
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete category with associated products");
        }
        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Category> searchCategories(String name, Pageable pageable) {
        if (!StringUtils.hasText(name)) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        return categoryRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    @Transactional(readOnly = true)
    public Category getCategory(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Category> getCategoriesWithLowStock(int threshold, Pageable pageable) {
        if (threshold < 0) {
            throw new IllegalArgumentException("Threshold cannot be negative");
        }
        return categoryRepository.findCategoriesWithLowStock(threshold, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Category> getEmptyCategories(Pageable pageable) {
        return categoryRepository.findEmptyCategories(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Category> getCategoriesByProductCountRange(int minCount, int maxCount, Pageable pageable) {
        if (minCount < 0 || maxCount < 0) {
            throw new IllegalArgumentException("Product count cannot be negative");
        }
        if (minCount > maxCount) {
            throw new IllegalArgumentException("Minimum count cannot be greater than maximum count");
        }
        return categoryRepository.findByProductCountRange(minCount, maxCount, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Object[]> getAllCategoriesWithProductCount(Pageable pageable) {
        return categoryRepository.findAllWithProductCount(pageable);
    }

    @Transactional(readOnly = true)
    public List<Category> getEmptyCategories() {
        return categoryRepository.findEmptyCategories();
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesWithLowStock(int threshold) {
        if (threshold < 0) {
            throw new IllegalArgumentException("Threshold cannot be negative");
        }
        return categoryRepository.findCategoriesWithLowStock(threshold);
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesWithOutOfStockProducts() {
        return categoryRepository.findCategoriesWithOutOfStockProducts();
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesWithInStockProducts() {
        return categoryRepository.findCategoriesWithInStockProducts();
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesWithMoreThanProducts(int count) {
        if (count < 0) {
            throw new IllegalArgumentException("Product count cannot be negative");
        }
        return categoryRepository.findCategoriesWithMoreThanProducts(count);
    }

    @Transactional(readOnly = true)
    public List<Category> getCategoriesWithLessThanProducts(int count) {
        if (count < 0) {
            throw new IllegalArgumentException("Product count cannot be negative");
        }
        return categoryRepository.findCategoriesWithLessThanProducts(count);
    }

    @Transactional(readOnly = true)
    public List<Category> searchCategories(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            throw new IllegalArgumentException("Search keyword cannot be empty");
        }
        return categoryRepository.searchCategories(keyword);
    }

    private void validateCategory(Category category) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        if (!StringUtils.hasText(category.getName())) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        if (category.getName().length() > MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("Category name cannot be longer than " + MAX_NAME_LENGTH + " characters");
        }
        if (category.getDescription() != null && category.getDescription().length() > MAX_DESCRIPTION_LENGTH) {
            throw new IllegalArgumentException("Category description cannot be longer than " + MAX_DESCRIPTION_LENGTH + " characters");
        }
    }
}
