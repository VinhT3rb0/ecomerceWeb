//package org.do_an.be.service;
//
//import com.github.javafaker.Faker;
//import org.do_an.be.entity.*;
//import org.do_an.be.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import jakarta.annotation.PostConstruct;
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//public class FakeService {
//
//    @Autowired
//    private ProductRepository productRepository;
//
//    @Autowired
//    private CategoryRepository categoryRepository;
//
//    @Autowired
//    private ProductImageRepository productImageRepository;
//
//    @Autowired
//    private ProductDetailRepository productDetailRepository;
//
//    private Faker faker = new Faker();
//
//    @PostConstruct
//    public void generateFakeData() {
//        generateFakeProducts(10);
//    }
//
//    private void generateFakeCategories(int count) {
//        List<Category> categories = new ArrayList<>();
//        for (int i = 0; i < count; i++) {
//            Category category = new Category();
//            category.setName(faker.commerce().department());
//            categories.add(category);
//        }
//        categoryRepository.saveAll(categories);
//    }
//
//    private void generateFakeProducts(int count) {
//        List<Product> products = new ArrayList<>();
//        List<Category> categories = categoryRepository.findAll();
//
//        for (int i = 0; i < count; i++) {
//            Product product = new Product();
//            product.setName(faker.commerce().productName());
//            product.setSku(faker.code().isbn13());
//            product.setInventory(faker.number().numberBetween(0, 100));
//            product.setPrice(Float.parseFloat(faker.commerce().price()));
//            product.setCategory(categories.get(faker.number().numberBetween(1, categories.size())));
//            product.setDescription(faker.lorem().paragraph());
//
//            List<ProductDetail> productDetails = new ArrayList<>();
//            ProductDetail productDetail = new ProductDetail();
//            productDetail.setCpu("i5");
//            productDetail.setRam(faker.number().numberBetween(4, 64));
//            productDetail.setDisplay(faker.commerce().material());
//            productDetail.setVga(faker.commerce().color());
//            productDetail.setDrive(faker.commerce().material());
//            productDetail.setProduct(product);
//            productDetails.add(productDetail);
//            product.setProductDetails(productDetails);
//
//
//
//            List<ProductImage> productImages = new ArrayList<>();
//            for (int j = 0; j < faker.number().numberBetween(1, 3); j++) {
//                ProductImage productImage = new ProductImage();
//                productImage.setImageUrl(faker.internet().image());
//                productImage.setProduct(product);
//                productImages.add(productImage);
//            }
//            product.setProductImages(productImages);
//
//            products.add(product);
//        }
//        productRepository.saveAll(products);
//    }
//}
