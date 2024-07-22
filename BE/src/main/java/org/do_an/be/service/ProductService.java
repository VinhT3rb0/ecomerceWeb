package org.do_an.be.service;

import lombok.RequiredArgsConstructor;
import org.do_an.be.dtos.ProductDTO;
import org.do_an.be.dtos.ProductDetailDTO;
import org.do_an.be.dtos.ProductImageDTO;
import org.do_an.be.entity.Category;
import org.do_an.be.entity.Product;
import org.do_an.be.entity.ProductImage;
import org.do_an.be.exception.DataNotFoundException;
import org.do_an.be.exception.InvalidParamException;
import org.do_an.be.repository.CategoryRepository;
import org.do_an.be.repository.ProductDetailRepository;
import org.do_an.be.repository.ProductImageRepository;
import org.do_an.be.repository.ProductRepository;
import org.do_an.be.responses.product.ProductListResponse;
import org.do_an.be.responses.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductDetailRepository productDetailRepository;
    private final ProductDetailService productDetailService;
    @Transactional
    public Product createProduct(ProductDTO productDTO) throws DataNotFoundException {
        Category existingCategory = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: "+productDTO.getCategoryId()));

        Product newProduct = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .description(productDTO.getDescription())
                .sku(productDTO.getSku())
                .inventory(productDTO.getInventory())
                .category(existingCategory)
                .discount(productDTO.getDiscount())
                .build();
        return productRepository.save(newProduct);
    }


    public Product getProductById(long productId) throws Exception {
        Optional<Product> optionalProduct = productRepository.getDetailProduct(productId);
        if(optionalProduct.isPresent()) {
            return optionalProduct.get();
        }
        throw new DataNotFoundException("Cannot find product with id =" + productId);
    }
    public Page<ProductResponse> getAllProducts(String keyword,
                                                Long categoryId, PageRequest pageRequest) {
        // Lấy danh sách sản phẩm theo trang (page), giới hạn (limit), và categoryId (nếu có)
        Page<Product> productsPage;
        productsPage = productRepository.searchProducts(categoryId, keyword, pageRequest);
        return productsPage.map(ProductResponse::fromProduct);
    }
    public List<ProductResponse> getAllProducts() {
        List<Product> allProducts = productRepository.findAll();
        return allProducts.stream()
                .map(ProductResponse::fromProduct)
                .collect(Collectors.toList());
    }
    @Transactional
    public Product updateProduct(
            Integer id,
            ProductDTO productDTO
//            , ProductDetailDTO productDetailDTO
    )
            throws Exception {
        Product existingProduct = getProductById(id);
        if(existingProduct != null) {
            //copy các thuộc tính từ DTO -> Product
            //Có thể sử dụng ModelMapper
            Category existingCategory = categoryRepository
                    .findById(productDTO.getCategoryId())
                    .orElseThrow(() ->
                            new DataNotFoundException(
                                    "Cannot find category with id: "+productDTO.getCategoryId()));
            if(productDTO.getName() != null && !productDTO.getName().isEmpty()) {
                existingProduct.setName(productDTO.getName());
            }

            existingProduct.setCategory(existingCategory);
            if(productDTO.getPrice() >= 0) {
                existingProduct.setPrice(productDTO.getPrice());
            }
            if(productDTO.getDescription() != null &&
                    !productDTO.getDescription().isEmpty()) {
                existingProduct.setDescription(productDTO.getDescription());
            }
            if(productDTO.getSku() != null &&
                    !productDTO.getSku().isEmpty()) {
                existingProduct.setSku(productDTO.getSku());
            }
            if(productDTO.getInventory() >= 0) {
                existingProduct.setInventory(productDTO.getInventory());
            }
            if(productDTO.getDiscount() >= 0) {
                existingProduct.setDiscount(productDTO.getDiscount());
            }
//            if(productDetailDTO!=null){
//                productDetailService.updateProductDetail(id,productDetailDTO);
//            }
            return productRepository.save(existingProduct);
        }
        return null;
    }
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }
    @Transactional
    public ProductImage createProductImage(
            Integer productId,
            ProductImageDTO productImageDTO) throws Exception {
        Product existingProduct = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find product with id: "+productImageDTO.getProductId()));
        ProductImage newProductImage = ProductImage.builder()
                .product(existingProduct)
                .imageUrl(productImageDTO.getImageUrl())
                .build();
        //Ko cho insert quá 5 ảnh cho 1 sản phẩm
        int size = productImageRepository.findByProductId(productId).size();
        if(size >= ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
            throw new InvalidParamException(
                    "Number of images must be <= "
                            +ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
        }

        productRepository.save(existingProduct);
        return productImageRepository.save(newProductImage);
    }
    @Transactional
    public void deleteProduct(Integer id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        optionalProduct.ifPresent(productRepository::delete);
    }
}
