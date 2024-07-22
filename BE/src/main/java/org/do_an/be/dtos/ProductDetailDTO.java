package org.do_an.be.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link org.do_an.be.entity.ProductDetail}
 */
@Data
@Getter
@Setter
@AllArgsConstructor
@Builder
public class ProductDetailDTO {

    Integer ram;
    @Size(max = 255)
    String cpu;
    @Size(max = 255)
    String display;
    @Size(max = 255)
    String vga;
    @Size(max = 255)
    String drive;
    private String battery;
    private String frontCamera;
    private String behindCamera;
}