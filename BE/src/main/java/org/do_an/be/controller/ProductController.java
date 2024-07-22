package org.do_an.be.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.javafaker.Faker;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.do_an.be.components.LocalizationUtils;
import org.do_an.be.dtos.CategoryDTO;
import org.do_an.be.dtos.ProductDTO;
import org.do_an.be.dtos.ProductDetailDTO;
import org.do_an.be.dtos.ProductImageDTO;
import org.do_an.be.entity.Product;
import org.do_an.be.entity.ProductDetail;
import org.do_an.be.entity.ProductImage;
import org.do_an.be.exception.DataNotFoundException;
import org.do_an.be.responses.ResponseObject;
import org.do_an.be.responses.product.ProductListResponse;
import org.do_an.be.responses.product.ProductResponse;
import org.do_an.be.service.CloudinaryService;
import org.do_an.be.service.ProductDetailService;
import org.do_an.be.service.ProductService;
import org.do_an.be.utils.FileUtils;
import org.do_an.be.utils.MessageKeys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RequestMapping("/api/products")
@RestController
@RequiredArgsConstructor
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final   ProductService productService;
    private final ProductDetailService productDetailService;

    private final LocalizationUtils localizationUtils;
    private final CloudinaryService cloudinaryService;
    @PostMapping(value = "" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> insertProduct(
            @Valid @ModelAttribute ProductDTO productDTO,
            @ModelAttribute("files") List<MultipartFile> files,
             @ModelAttribute ProductDetailDTO productDetailDTO,

            BindingResult result
//            @RequestPart("file") MultipartFile file
    ) throws Exception {
        //MultipartFile file = productDTO.getFile();

        if(files.size() > ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(localizationUtils
                                    .getLocalizedMessage(MessageKeys.UPLOAD_IMAGES_MAX_5))
                            .build()
            );
        }
        if(result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(String.join("; ", errorMessages))
                            .status(HttpStatus.BAD_REQUEST)
                            .build()
            );
        }
        Product newProduct = productService.createProduct(productDTO);
        int prouctid = newProduct.getId();
        String filename = storeFile(newProduct.getId(),files);
        if(productDetailDTO.getRam()!= null){
            ProductDetail newProductDetail = productDetailService.createProduct(productDetailDTO,newProduct.getId());
        }
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .message("Create new product successfully")
                        .status(HttpStatus.CREATED)
                        .data(newProduct)
                        .build());
    }
//    private String storeFile(MultipartFile file)throws IOException{
//        String filename = StringUtils.cleanPath(file.getOriginalFilename());
//        String uniqueFilename = UUID.randomUUID().toString() + "_" +filename;
//        Path uploadDir = Paths.get("uploads");
//        if(!Files.exists(uploadDir)){
//            Files.createDirectories(uploadDir);
//        }
//        java.nio.file.Path destination = Paths.get(uploadDir.toString(),uniqueFilename);
//        Files.copy(file.getInputStream(),destination, StandardCopyOption.REPLACE_EXISTING);
//        return uniqueFilename;
//    }
    private String storeFile(Integer productId, List<MultipartFile> files) throws Exception {
        files = files == null ? new ArrayList<MultipartFile>() : files;

        List<ProductImage> productImages = new ArrayList<>();
        for (MultipartFile file : files) {
            if(file.getSize() == 0) {
                continue;
            }
            // Kiểm tra kích thước file và định dạng
            if(file.getSize() > 10 * 1024 * 1024) { // Kích thước > 10MB
                return "False";
            }
            String contentType = file.getContentType();
            if(contentType == null || !contentType.startsWith("image/")) {
                return "False";
            }
            // Lưu file và cập nhật thumbnail trong DTO
            //String filename = FileUtils.storeFile(file);
            String folerName = "image";
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, "image");
            String imageUrl = uploadResult.get("url").toString();

            //lưu vào đối tượng product trong DB
            ProductImage productImage = productService.createProductImage(
                    productId,
                    ProductImageDTO.builder()
                            .imageUrl(imageUrl)
                            .build()
            );
            productImages.add(productImage);
        }
        return "OK";
    }
    @GetMapping("/detail")
    public ResponseEntity<ResponseObject> getProductById(
//            @PathVariable("id") Long productId
            @RequestParam int productId
    ) throws Exception {
        Product existingProduct = productService.getProductById(productId);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(ProductResponse.fromProduct(existingProduct))
                .message("Get detail product successfully")
                .status(HttpStatus.OK)
                .build());

    }

    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ROLE_ADMIN')")
//    @Operation(security = { @SecurityRequirement(name = "bearer-key") })
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(null)
                .message(String.format("Product with id = %d deleted successfully", id))
                .status(HttpStatus.OK)
                .build());
    }
    @GetMapping("")
    public ResponseEntity<ResponseObject> getProducts(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0", name = "category_id") Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) throws JsonProcessingException {
        int totalPages = 0;
        //productRedisService.clear();
        // Tạo Pageable từ thông tin trang và giới hạn
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                //Sort.by("createdAt").descending()
                Sort.by("id").ascending()
        );
//        logger.info(String.format("keyword = %s, category_id = %d, page = %d, limit = %d",
//                keyword, categoryId, page, limit));
//        List<ProductResponse> productResponses = productRedisService
//                .getAllProducts(keyword, categoryId, pageRequest);
        Page<ProductResponse> productResponses = productService
                .getAllProducts(keyword, categoryId, pageRequest);
        // Lấy tổng số trang
        totalPages = productResponses.getTotalPages();
        List<ProductResponse> productResponseList = productResponses.getContent();
        // Bổ sung totalPages vào các đối tượng ProductResponse
        for (ProductResponse product : productResponses) {
            product.setTotalPages(totalPages);
        }
        ProductListResponse productListResponse = ProductListResponse
                .builder()
                .products(productResponseList)
                .totalPages(totalPages)
                .build();
        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Get products successfully")
                .status(HttpStatus.OK)
                .data(productListResponse)
                .build());
    }
    @GetMapping("/all")
    public ResponseEntity<ResponseObject> getAllProducts(

    ) throws JsonProcessingException {

        List<ProductResponse> productResponses = productService.getAllProducts();
        // Lấy tổng số trang
        ProductListResponse productListResponse = ProductListResponse
                .builder()
                .products(productResponses)
                .build();
        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Get products successfully")
                .status(HttpStatus.OK)
                .data(productListResponse)
                .build());
    }
    @PostMapping(value = "uploads/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    //POST http://localhost:8088/v1/api/products
    public ResponseEntity<ResponseObject> uploadImages(
            @PathVariable("id") Long productId,
            @ModelAttribute("files") List<MultipartFile> files
    ) throws Exception {
        Product existingProduct = productService.getProductById(productId);
        files = files == null ? new ArrayList<MultipartFile>() : files;
        if(files.size() > ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(localizationUtils
                                    .getLocalizedMessage(MessageKeys.UPLOAD_IMAGES_MAX_5))
                            .build()
            );
        }
        List<ProductImage> productImages = new ArrayList<>();
        for (MultipartFile file : files) {
            if(file.getSize() == 0) {
                continue;
            }
            // Kiểm tra kích thước file và định dạng
            if(file.getSize() > 10 * 1024 * 1024) { // Kích thước > 10MB
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                        .body(ResponseObject.builder()
                                .message(localizationUtils
                                        .getLocalizedMessage(MessageKeys.UPLOAD_IMAGES_FILE_LARGE))
                                .status(HttpStatus.PAYLOAD_TOO_LARGE)
                                .build());
            }
            String contentType = file.getContentType();
            if(contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                        .body(ResponseObject.builder()
                                .message(localizationUtils
                                        .getLocalizedMessage(MessageKeys.UPLOAD_IMAGES_FILE_MUST_BE_IMAGE))
                                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                                .build());
            }
            // Lưu file và cập nhật thumbnail trong DTO
            //String filename = FileUtils.storeFile(file);
            String folerName = "image";
            Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, "image");
            String imageUrl = uploadResult.get("url").toString();

            //lưu vào đối tượng product trong DB
            ProductImage productImage = productService.createProductImage(
                    existingProduct.getId(),
                    ProductImageDTO.builder()
                            .imageUrl(imageUrl)
                            .build()
            );
            productImages.add(productImage);
        }

        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Upload image successfully")
                .status(HttpStatus.CREATED)
                .data(productImages)
                .build());
    }
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName) {
        try {
            java.nio.file.Path imagePath = Paths.get("uploads/"+imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                logger.info(imageName + " not found");
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(new UrlResource(Paths.get("uploads/notfound.jpeg").toUri()));
                //return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error occurred while retrieving image: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/generateFakeProducts")
    private ResponseEntity<ResponseObject> generateFakeProducts() throws Exception {
        Faker faker = new Faker();
        for (int i = 0; i < 10; i++) {
            String productName = faker.commerce().productName();
            if(productService.existsByName(productName)) {
                continue;
            }
            ProductDTO productDTO = ProductDTO.builder()
                    .name(productName)
                    .price((float)faker.number().numberBetween(10, 90_000_000))
                    .description(faker.lorem().sentence())
                    .categoryId((Integer) faker.number().numberBetween(1, 3))
                    .sku("")
                    .inventory(10)

                    .build();
            productService.createProduct(productDTO);

        }
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Insert fake products succcessfully")
                .data(null)
                .status(HttpStatus.OK)
                .build());
    }
    @PutMapping( "/{id}")
    //@SecurityRequirement(name="bearer-key")
    public ResponseEntity<ResponseObject> updateProduct(
            @PathVariable Integer id,
            @RequestBody ProductDTO productDTO) throws Exception {
        Product updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .data(updatedProduct)
                .message("Update product successfully")
                .status(HttpStatus.OK)
                .build());
    }
}