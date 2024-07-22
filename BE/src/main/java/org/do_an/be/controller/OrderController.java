package org.do_an.be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.do_an.be.dtos.OrderDTO;
import org.do_an.be.entity.Order;
import org.do_an.be.entity.User;
import org.do_an.be.responses.ResponseObject;
import org.do_an.be.responses.order.OrderResponse;
import org.do_an.be.security.SecurityUtils;
import org.do_an.be.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final SecurityUtils securityUtils;


    @PostMapping("")
    //@PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ResponseObject> createOrder(
            @Valid @RequestBody OrderDTO orderDTO,
            BindingResult result
    ) throws Exception {
        if(result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(String.join(";", errorMessages))
                            .status(HttpStatus.BAD_REQUEST)
                            .build());
        }
        //User loginUser = securityUtils.getLoggedInUser();
//        if(orderDTO.getUserId() == null) {
//            orderDTO.setUserId(loginUser.getId());
//        }
        Order orderResponse = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Insert order successfully")
                .data(orderResponse)
                .status(HttpStatus.OK)
                .build());
    }
    @GetMapping("/user/{user_id}") // Thêm biến đường dẫn "user_id"
    //GET http://localhost:8088/api/v1/orders/user/4
    public ResponseEntity<ResponseObject> getOrders(@Valid @PathVariable("user_id") Long userId) {
        User loginUser = securityUtils.getLoggedInUser();
        boolean isUserIdBlank = userId == null || userId <= 0;
        List<OrderResponse> orderResponses = orderService.findByUserId(isUserIdBlank ? loginUser.getId() : userId);
        return ResponseEntity.ok(ResponseObject
                .builder()
                .message("Get list of orders successfully")
                .data(orderResponses)
                .status(HttpStatus.OK)
                .build());
    }
    //GET http://localhost:8088/api/v1/orders/2
    @GetMapping("/{id}")
    public ResponseEntity<ResponseObject> getOrder(@Valid @PathVariable("id") Integer orderId) {
        Order existingOrder = orderService.getOrderById(orderId);
        OrderResponse orderResponse = OrderResponse.fromOrder(existingOrder);
        return ResponseEntity.ok(new ResponseObject(
                "Get order successfully",
                HttpStatus.OK,
                orderResponse
        ));
    }

    @GetMapping("/get-orders-by-keyword")
    public ResponseEntity<ResponseObject> getOrdersByKeyword(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        // Tạo Pageable từ thông tin trang và giới hạn
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                //Sort.by("createdAt").descending()
                Sort.by("id").ascending()
        );
        Page<OrderResponse> orderPage = orderService
                .getOrdersByKeyword(keyword, pageRequest)
                .map(OrderResponse::fromOrder);
        // Lấy tổng số trang
        int totalPages = orderPage.getTotalPages();
        List<OrderResponse> orderResponses = orderPage.getContent();
        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Get orders successfully")
                .status(HttpStatus.OK)
                .data(orderResponses)
                .build());
    }
    @PutMapping("/{id}")

    //PUT http://localhost:8088/api/v1/orders/2
    //công việc của admin
    public ResponseEntity<ResponseObject> updateOrder(
            @Valid @PathVariable Integer id,
            @Valid @RequestBody OrderDTO orderDTO) throws Exception {

        Order order = orderService.updateOrder(id, orderDTO);
        return ResponseEntity.ok(new ResponseObject("Update order successfully", HttpStatus.OK, order));
    }

    @PutMapping("/status/{id}")

    //PUT http://localhost:8088/api/v1/orders/2
    //công việc của admin
    public ResponseEntity<ResponseObject> updateOrderStatus(
            @Valid @PathVariable Integer id,
            @Valid @RequestParam String status) throws Exception {

        Order order = orderService.updateOrderStatus(id,status);
        return ResponseEntity.ok(new ResponseObject("Update order status successfully", HttpStatus.OK, order));
    }

    @DeleteMapping("/{id}")

    //PUT http://localhost:8088/api/v1/orders/2
    //công việc của admin
    public ResponseEntity<ResponseObject> deleteOrder(
            @Valid @PathVariable Integer id
           ) throws Exception {

        orderService.deleteOrder(id);
        return ResponseEntity.ok(new ResponseObject("Delete order successfully", HttpStatus.OK,null));
    }
}
