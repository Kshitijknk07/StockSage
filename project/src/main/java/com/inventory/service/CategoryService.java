package com.inventory.service;

import com.inventory.model.Category;
import com.inventory.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Category createCategory(Category category) {
        validateCategory(category);
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with name '" + category.getName() + "' already exists");
        }
        return categoryRepository.save(category);
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

    @Transactional
    public Category updateCategory(Long id, Category category) {
        validateCategory(category);
        Category existing = getCategory(id);
        
        if (!existing.getName().equals(category.getName()) && 
            categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with name '" + category.getName() + "' already exists");
        }
        
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        return categoryRepository.save(existing);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategory(id);
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete category with associated products");
        }
        categoryRepository.deleteById(id);
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

    private void validateCategory(Category category) {
        if (category == null) {
            throw new IllegalArgumentException("Category cannot be null");
        }
        if (!StringUtils.hasText(category.getName())) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        if (category.getName().length() > 100) {
            throw new IllegalArgumentException("Category name cannot be longer than 100 characters");
        }
    }
}
