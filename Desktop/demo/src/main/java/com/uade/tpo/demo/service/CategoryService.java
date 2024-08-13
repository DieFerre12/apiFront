package com.uade.tpo.demo.service;

import java.util.ArrayList;

import com.uade.tpo.demo.entity.Category;
import com.uade.tpo.demo.repository.CategoryRepository;

public class CategoryService {

    public ArrayList<Category> getCategories() {
        CategoryRepository categoryRepository = new CategoryRepository();
        return categoryRepository.getCategories();
    }

    public Category getCategoryById(int categoryId) {
        CategoryRepository categoryRepository = new CategoryRepository();
        return categoryRepository.getCategoryById(categoryId);
    }
    
    public String createCategory (String entity) {
        CategoryRepository categoryRepository = new CategoryRepository();
        return categoryRepository.createCategory(entity);
    }
}
