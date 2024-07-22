package org.do_an.be.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateUserDTO {


    private String telephone;

    private String address;

    @JsonProperty("password")
    private String password;

    @JsonProperty("retype_password")
    private String retypePassword;
}
