package org.do_an.be.responses.coupon;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponCalculationResponse {
    @JsonProperty("result")
    private Double result;
}
