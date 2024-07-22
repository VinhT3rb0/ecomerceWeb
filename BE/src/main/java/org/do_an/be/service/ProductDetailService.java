package org.do_an.be.service;

import lombok.RequiredArgsConstructor;
import org.do_an.be.dtos.ProductDTO;
import org.do_an.be.dtos.ProductDetailDTO;
import org.do_an.be.entity.Category;
import org.do_an.be.entity.Product;
import org.do_an.be.entity.ProductDetail;
import org.do_an.be.exception.DataNotFoundException;
import org.do_an.be.repository.CategoryRepository;
import org.do_an.be.repository.ProductDetailRepository;
import org.do_an.be.repository.ProductImageRepository;
import org.do_an.be.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductDetailService {
    private final ProductRepository productRepository;
    private final ProductDetailRepository productDetailRepository;
    @Transactional
    public ProductDetail createProduct(ProductDetailDTO productDetailDTO,Integer id) throws DataNotFoundException {
        Product existingProduct = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: "+id));

        ProductDetail newProductDetail = ProductDetail.builder()
                .cpu(productDetailDTO.getCpu())
                .vga(productDetailDTO.getVga())
                .ram(productDetailDTO.getRam())
                .drive(productDetailDTO.getDrive())
                .display(productDetailDTO.getDisplay())
                .battery(productDetailDTO.getBattery())
                .behindCamera(productDetailDTO.getBehindCamera())
                .frontCamera(productDetailDTO.getFrontCamera())
                .product(existingProduct)
                .build();
        return productDetailRepository.save(newProductDetail);
    }
    @Transactional
    public ProductDetail updateProductDetail(Integer id, ProductDetailDTO productDetailDTO) throws DataNotFoundException {
        ProductDetail existingProductDetail = productDetailRepository.findByProductId(id);
        if (existingProductDetail != null) {
            // Copy properties from DTO to ProductDetail entity
            if (productDetailDTO.getRam() != null) {
                existingProductDetail.setRam(productDetailDTO.getRam());
            }
            if (productDetailDTO.getCpu() != null) {
                existingProductDetail.setCpu(productDetailDTO.getCpu());
            }
            if (productDetailDTO.getDisplay() != null) {
                existingProductDetail.setDisplay(productDetailDTO.getDisplay());
            }
            if (productDetailDTO.getVga() != null) {
                existingProductDetail.setVga(productDetailDTO.getVga());
            }
            if (productDetailDTO.getDrive() != null) {
                existingProductDetail.setDrive(productDetailDTO.getDrive());
            }
            if (productDetailDTO.getBattery() != null) {
                existingProductDetail.setBattery(productDetailDTO.getBattery());
            }
            if (productDetailDTO.getBehindCamera() != null) {
                existingProductDetail.setBehindCamera(productDetailDTO.getBehindCamera());
            }
            if (productDetailDTO.getFrontCamera() != null) {
                existingProductDetail.setFrontCamera(productDetailDTO.getFrontCamera());
            }

            // Save updated product detail
            return productDetailRepository.save(existingProductDetail);
        } else {
            createProduct(productDetailDTO,id);
            return null;
        }
}}

