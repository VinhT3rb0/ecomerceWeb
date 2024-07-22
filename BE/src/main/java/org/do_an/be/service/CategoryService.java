package org.do_an.be.service;

import lombok.RequiredArgsConstructor;
import org.do_an.be.dtos.CategoryDTO;
import org.do_an.be.entity.Category;
import org.do_an.be.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public Category createCategory(CategoryDTO categoryDTO) {
        Category newCategory = new Category();
        newCategory.setName(categoryDTO.getName());
        return categoryRepository.save(newCategory);
    }
    @Transactional
    public Category updateCategory(int categoryId,
                                   CategoryDTO categoryDTO) {
        Category existingCategory = getCategoryById(categoryId);
        existingCategory.setName(categoryDTO.getName());
        categoryRepository.save(existingCategory);
        return existingCategory;
    }

    public Category getCategoryById(int id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Transactional
    public void deleteCategory(int id) {
        //xóa xong
        categoryRepository.deleteById(id);
    }
}
