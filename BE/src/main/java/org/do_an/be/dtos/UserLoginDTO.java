package org.do_an.be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class UserLoginDTO {

    @JsonProperty("username_email")
    private String usernameOrEmail;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}

