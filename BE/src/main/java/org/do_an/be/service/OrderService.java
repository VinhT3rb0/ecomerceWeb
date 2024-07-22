package org.do_an.be.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.do_an.be.dtos.CartItemDTO;
import org.do_an.be.dtos.OrderDTO;
import org.do_an.be.dtos.OrderDetailDTO;
import org.do_an.be.dtos.OrderWithDetailsDTO;
import org.do_an.be.entity.*;
import org.do_an.be.exception.DataNotFoundException;
import org.do_an.be.repository.OrderDetailRepository;
import org.do_an.be.repository.OrderRepository;
import org.do_an.be.repository.ProductRepository;
import org.do_an.be.repository.UserRepository;
import org.do_an.be.responses.order.OrderResponse;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;

    private final ModelMapper modelMapper;

    @Transactional
    public Order createOrder(OrderDTO orderDTO) throws Exception {
        User user = userRepository
                .findById(orderDTO.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: " + orderDTO.getUserId()));
        //convert orderDTO => Order
        //dùng thư viện Model Mapper
        // Tạo một luồng bảng ánh xạ riêng để kiểm soát việc ánh xạ
//        modelMapper.typeMap(OrderDTO.class, Order.class)
//                .addMappings(mapper -> mapper.skip(Order::setId));
        // Cập nhật các trường của đơn hàng từ orderDTO
        Order order = new Order();
        modelMapper.map(orderDTO, order);
        order.setId(null);
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());//lấy thời điểm hiện tại
        order.setStatus(OrderStatus.PENDING);
        //Kiểm tra shipping date phải >= ngày hôm nay
        LocalDate shippingDate = orderDTO.getShippingDate() == null
                ? LocalDate.now() : orderDTO.getShippingDate();
        if (shippingDate.isBefore(LocalDate.now())) {
            throw new DataNotFoundException("Date must be at least today !");
        }
        order.setShippingDate(shippingDate);
        order.setTotalMoney(orderDTO.getTotalMoney());
        // Tạo danh sách các đối tượng OrderDetail từ cartItems
        List<OrderDetail> orderDetails = new ArrayList<>();
        for (CartItemDTO cartItemDTO : orderDTO.getCartItems()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            // Lấy thông tin sản phẩm từ cartItemDTO
            Integer productId = cartItemDTO.getProductId();
            int quantity = cartItemDTO.getQuantity();
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new DataNotFoundException("Product not found with id: " + productId));
            // Đặt thông tin cho OrderDetail
            if (product.getInventory() >= quantity) {
                product.setInventory(product.getInventory() - quantity);
                productRepository.save(product);

            } else {
                throw new RuntimeException("Không đủ số lượng " + product.getName() + " trong kho để đáp ứng đơn hàng.");
            }
            orderDetail.setProduct(product);
            orderDetail.setNumberOfProducts(quantity);
            // Các trường khác của OrderDetail nếu cần
            orderDetail.setPrice(product.getPrice());
            orderDetail.setTotalMoney(product.getPrice() * quantity);
            // Thêm OrderDetail vào danh sách
            orderDetails.add(orderDetail);
        }
        //coupon
//        String couponCode = orderDTO.getCouponCode();
//        if (!couponCode.isEmpty()) {
//            Coupon coupon = couponRepository.findByCode(couponCode)
//                    .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
//
//            if (!coupon.isActive()) {
//                throw new IllegalArgumentException("Coupon is not active");
//            }
//
//            order.setCoupon(coupon);
//        } else {
//            order.setCoupon(null);
//        }
        // Lưu danh sách OrderDetail vào cơ sở dữ liệu
        log.error("order: {}", order);

        log.error("orderd: {}", orderDetails);
        //order.setOrderDetails(orderDetails);
        orderRepository.save(order);
        orderDetailRepository.saveAll(orderDetails);

        return order;
    }

    @Transactional
    public Order updateOrderWithDetails(OrderWithDetailsDTO orderWithDetailsDTO) {
        modelMapper.typeMap(OrderWithDetailsDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        Order order = new Order();
        modelMapper.map(orderWithDetailsDTO, order);
        Order savedOrder = orderRepository.save(order);

        // Set the order for each order detail
        for (OrderDetailDTO orderDetailDTO : orderWithDetailsDTO.getOrderDetailDTOS()) {
            //orderDetail.setOrder(OrderDetail);
        }

        // Save or update the order details
        List<OrderDetail> savedOrderDetails = orderDetailRepository.saveAll(order.getOrderDetails());

        // Set the updated order details for the order
        savedOrder.setOrderDetails(savedOrderDetails);

        return savedOrder;
    }

    public Order getOrderById(Integer orderId) {
        Order selectedOrder = orderRepository.findById(orderId).orElse(null);
        return selectedOrder;
    }

    @Transactional
    public Order updateOrder(Integer id, OrderDTO orderDTO)
            throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        User existingUser = userRepository.findById(
                orderDTO.getUserId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find user with id: " + id));
        /*
        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        modelMapper.map(orderDTO, order);
         */
        // Setting user
        if (orderDTO.getUserId() != null) {
            User user = new User();
            user.setId(orderDTO.getUserId());
            order.setUser(user);
        }

        if (orderDTO.getFullName() != null && !orderDTO.getFullName().trim().isEmpty()) {
            order.setFullName(orderDTO.getFullName().trim());
        }

        if (orderDTO.getEmail() != null && !orderDTO.getEmail().trim().isEmpty()) {
            order.setEmail(orderDTO.getEmail().trim());
        }

        if (orderDTO.getTelephone() != null && !orderDTO.getTelephone().trim().isEmpty()) {
            order.setTelephone(orderDTO.getTelephone().trim());

        }

        if (orderDTO.getStatus() != null && !orderDTO.getStatus().trim().isEmpty()) {
            order.setStatus(orderDTO.getStatus().trim());
        }

        if (orderDTO.getAddress() != null && !orderDTO.getAddress().trim().isEmpty()) {
            order.setAddress(orderDTO.getAddress().trim());
        }

        if (orderDTO.getNote() != null && !orderDTO.getNote().trim().isEmpty()) {
            order.setNote(orderDTO.getNote().trim());
        }

        if (orderDTO.getTotalMoney() != null) {
            order.setTotalMoney(orderDTO.getTotalMoney());
        }

        if (orderDTO.getShippingMethod() != null && !orderDTO.getShippingMethod().trim().isEmpty()) {
            order.setShippingMethod(orderDTO.getShippingMethod().trim());
        }

        if (orderDTO.getShippingAddress() != null && !orderDTO.getShippingAddress().trim().isEmpty()) {
            order.setShippingAddress(orderDTO.getShippingAddress().trim());
        }

        if (orderDTO.getShippingDate() != null) {
            order.setShippingDate(orderDTO.getShippingDate());
        }

        if (orderDTO.getPaymentMethod() != null && !orderDTO.getPaymentMethod().trim().isEmpty()) {
            order.setPaymentMethod(orderDTO.getPaymentMethod().trim());
        }

        order.setUser(existingUser);
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Integer id, String status) throws DataNotFoundException{
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }
    @Transactional
    public void deleteOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        //no hard-delete, => please soft-delete
        if (order != null) {
            //order.setActive(false);
            orderRepository.delete(order);
        }
    }

    public List<OrderResponse> findByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(order -> OrderResponse.fromOrder(order)).toList();
    }

    public List<OrderResponse> getAllOrders(Long userId) {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(order -> OrderResponse.fromOrder(order)).toList();
    }
    public Page<Order> getOrdersByKeyword(String keyword, Pageable pageable) {
        return orderRepository.findByKeyword(keyword, pageable);
    }
}

