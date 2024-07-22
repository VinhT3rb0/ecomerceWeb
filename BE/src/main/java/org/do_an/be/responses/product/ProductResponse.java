package org.do_an.be.responses.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;


import lombok.*;
import org.do_an.be.entity.*;
import org.do_an.be.responses.BaseResponse;
import org.do_an.be.responses.comment.CommentResponse;
import org.do_an.be.responses.favorite.FavoriteResponse;

import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse extends BaseResponse {
    private Integer id;
    private String name;
    private Float price;
    private String description;
    // Thêm trường totalPages
    private int totalPages;
    private String sku;
    private Integer inventory;
    @JsonProperty("product_images")
    private List<ProductImage> productImages = new ArrayList<>();
    private Integer discount;
    @JsonProperty("product_details")
    private List<ProductDetail> productDetail = new ArrayList<>();

//    @JsonProperty("comments")
//    private List<CommentResponse> comments = new ArrayList<>();

//    @JsonProperty("favorites")
//    private List<FavoriteResponse> favorites = new ArrayList<>();


    @JsonProperty("category_id")
    private Integer categoryId;
    public static ProductResponse fromProduct(Product product) {
        List<Comment> comments = product.getComments()
                .stream()
                .sorted(Comparator.comparing(Comment::getCreatedAt).reversed()) // Sort comments by createdAt in descending order
                .collect(Collectors.toList());

        ProductResponse productResponse = ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .discount(product.getDiscount())
                .price(product.getPrice())
                .sku(product.getSku())
                .inventory(product.getInventory())
                //.comments(comments.stream().map(CommentResponse::fromComment).toList()) // Collect sorted comments into a list
                .description(product.getDescription())
                .categoryId(product.getCategory().getId())
                .productImages(product.getProductImages())
                .productDetail(new ArrayList<>(product.getProductDetails()))
                .totalPages(0)
                .build();
        productResponse.setCreatedAt(product.getCreatedAt());
        productResponse.setUpdatedAt(product.getUpdatedAt());
        return productResponse;
    }
}
