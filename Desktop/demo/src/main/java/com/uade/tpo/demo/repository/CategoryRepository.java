package com.uade.tpo.demo.repository;

import java.util.ArrayList;
import java.util.Arrays;

import com.uade.tpo.demo.entity.Category;

public class CategoryRepository {
    public ArrayList<Category> categories = new ArrayList<Category>(
        Arrays.asList(Category.builder().description("Electronica").id(1).build(),
        Category.builder().description("Hogar").id(2).build(),
        Category.builder().description("Deportes").id(3).build()
        )
    );
    public ArrayList <Category> getCategories() {
        return this.categories;
    }

    public Category getCategoryById(int categoryId) {
        return null;
    }
    
    public String createCategory (String entity) {
        return null;
    }
}
