package org.do_an.be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private String telephone;
    private String email = "";
    @NotBlank(message = "Password cannot be blank")
    private String password = "";
    private String username;
    @JsonProperty("retype_password")
    private String retypePassword = "";


}