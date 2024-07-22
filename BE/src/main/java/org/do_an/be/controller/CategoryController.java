package org.do_an.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.do_an.be.components.LocalizationUtils;
import org.do_an.be.dtos.CategoryDTO;
import org.do_an.be.entity.Category;
import org.do_an.be.responses.ResponseObject;
import org.do_an.be.service.CategoryService;
import org.do_an.be.utils.MessageKeys;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/categories")
@RestController
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;
    private final LocalizationUtils localizationUtils;

    @GetMapping("")
    public ResponseEntity<ResponseObject> getAllCategories(
            @RequestParam(defaultValue = "0" ,name = "page")     int page,
            @RequestParam( defaultValue = "10",name="limit")    int limit
    ) {
        List<Category> categories = categoryService.getAllCategories();

        return ResponseEntity.ok(ResponseObject.builder()
                .message("Get list of categories successfully")
                .status(HttpStatus.OK)
                .data(categories)
                .build());
    }

    @PostMapping("")
    public ResponseEntity<ResponseObject> createCategory(
            @Valid @RequestBody CategoryDTO categoryDTO,
            BindingResult result) {
        if(result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.ok().body(ResponseObject.builder()
                    .message(errorMessages.toString())
                    .status(HttpStatus.BAD_REQUEST)
                    .data(null)
                    .build());

        }
        Category category = categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Create category successfully")
                .status(HttpStatus.OK)
                .data(category)
                .build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getCategoryById(
            @PathVariable("id") Integer categoryId
    ) {
        Category existingCategory = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(existingCategory)
                .message("Get category information successfully")
                .status(HttpStatus.OK)
                .build());
    }

    @PutMapping("/{id}")

    public ResponseEntity<ResponseObject> updateCategory(
            @PathVariable Integer id,
            @Valid @RequestBody CategoryDTO categoryDTO
    ) {
        categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(ResponseObject
                .builder()
                .data(categoryService.getCategoryById(id))
                .message(localizationUtils.getLocalizedMessage(MessageKeys.UPDATE_CATEGORY_SUCCESSFULLY))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteCategory(@PathVariable Integer id) throws Exception{
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete category successfully")
                        .build());
    }
}
