package org.do_an.be.responses.order;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.do_an.be.entity.Order;
import org.do_an.be.entity.OrderDetail;
import org.do_an.be.responses.order.OrderDetailResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private Integer id;

    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("fullname")
    private String fullName;

    @JsonProperty("telephone")
    private String telephone;

    @JsonProperty("email")
    private String email;

    @JsonProperty("address")
    private String address;

    @JsonProperty("note")
    private String note;

    @JsonProperty("order_date")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime orderDate;

    @JsonProperty("status")
    private String status;

    @JsonProperty("total_money")
    private double totalMoney;

    @JsonProperty("shipping_method")
    private String shippingMethod = "";

    @JsonProperty("shipping_address")
    private String shippingAddress = "";

    @JsonProperty("shipping_date")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "UTC")
    private LocalDate shippingDate;

    @JsonProperty("payment_method")
    private String paymentMethod = "";

    @JsonProperty("order_details")
    private List<OrderDetailResponse> orderDetails;

    public static OrderResponse fromOrder(Order order) {
        List<OrderDetail> orderDetails = order.getOrderDetails();
        List<OrderDetailResponse> orderDetailResponses = orderDetails
                .stream()
                .map(orderDetail -> OrderDetailResponse.fromOrderDetail(orderDetail)).toList();
        OrderResponse orderResponse =  OrderResponse
                .builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .fullName(order.getFullName())
                .telephone(order.getTelephone())
                .email(order.getEmail())
                .address(order.getAddress())
                .note(order.getNote())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalMoney(order.getTotalMoney())
                .shippingMethod(order.getShippingMethod())
                .shippingAddress(order.getShippingAddress())
                .shippingDate(order.getShippingDate())
                .paymentMethod(order.getPaymentMethod())
                .orderDetails(orderDetailResponses) //important
                .build();
        return orderResponse;
    }
}