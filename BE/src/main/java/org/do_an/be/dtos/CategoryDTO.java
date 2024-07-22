package org.do_an.be.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    @NotEmpty(message = "Category's name cannot be empty")
    private String name;
}
