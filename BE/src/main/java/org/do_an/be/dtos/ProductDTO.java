package org.do_an.be.dtos;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

/**
 * DTO for {@link org.do_an.be.entity.Product}
 */
@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDTO  {

   private String name;
   private String sku;
   private Float price;
   private Integer categoryId;
   //private MultipartFile file;
   private String description;
   private Integer inventory;
   private Integer discount;


}