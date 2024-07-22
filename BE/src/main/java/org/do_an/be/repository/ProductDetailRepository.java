package org.do_an.be.repository;

import org.do_an.be.entity.Product;
import org.do_an.be.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
    @Query("SELECT pd FROM ProductDetail pd WHERE pd.product.id = :productId")
    ProductDetail findProductDetailByProductId(@Param("productId") Integer productId);

    ProductDetail findByProductId(@Param("productId") Integer productId);

}