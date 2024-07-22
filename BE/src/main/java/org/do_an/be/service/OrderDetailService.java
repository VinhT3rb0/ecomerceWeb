package org.do_an.be.service;

import lombok.RequiredArgsConstructor;
import org.do_an.be.dtos.OrderDetailDTO;
import org.do_an.be.entity.Order;
import org.do_an.be.entity.OrderDetail;
import org.do_an.be.entity.Product;
import org.do_an.be.exception.DataNotFoundException;
import org.do_an.be.repository.OrderDetailRepository;
import org.do_an.be.repository.OrderRepository;
import org.do_an.be.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class OrderDetailService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDetail createOrderDetail(OrderDetailDTO orderDetailDTO) throws Exception {
        //tìm xem orderId có tồn tại ko
        Order order = orderRepository.findById(orderDetailDTO.getOrderId())
                .orElseThrow(() -> new DataNotFoundException(
                        "Cannot find Order with id : "+orderDetailDTO.getOrderId()));
        // Tìm Product theo id
        Product product = productRepository.findById(orderDetailDTO.getProductId())
                .orElseThrow(() -> new DataNotFoundException(
                        "Cannot find product with id: " + orderDetailDTO.getProductId()));
        OrderDetail orderDetail = OrderDetail.builder()
                .order(order)
                .product(product)
                .numberOfProducts(orderDetailDTO.getNumberOfProducts())
                .price(orderDetailDTO.getPrice())
                .totalMoney(orderDetailDTO.getTotalMoney())
//                .color(orderDetailDTO.getColor())
                .build();
        //lưu vào db
        return orderDetailRepository.save(orderDetail);
    }

    public OrderDetail getOrderDetail(Integer id) throws DataNotFoundException {
        return orderDetailRepository.findById(id)
                .orElseThrow(()->new DataNotFoundException("Cannot find OrderDetail with id: "+id));
    }

    @Transactional
    public OrderDetail updateOrderDetail(Integer id, OrderDetailDTO orderDetailDTO)
            throws DataNotFoundException {
        //tìm xem order detail có tồn tại ko đã
        OrderDetail existingOrderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Cannot find order detail with id: "+id));
        Order existingOrder = orderRepository.findById(orderDetailDTO.getOrderId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find order with id: "+id));
        Product existingProduct = productRepository.findById(orderDetailDTO.getProductId())
                .orElseThrow(() -> new DataNotFoundException(
                        "Cannot find product with id: " + orderDetailDTO.getProductId()));
        existingOrderDetail.setPrice(orderDetailDTO.getPrice());
        existingOrderDetail.setNumberOfProducts(orderDetailDTO.getNumberOfProducts());
        existingOrderDetail.setTotalMoney(orderDetailDTO.getTotalMoney());
//        existingOrderDetail.setColor(orderDetailDTO.getColor());
        existingOrderDetail.setOrder(existingOrder);
        existingOrderDetail.setProduct(existingProduct);
        return orderDetailRepository.save(existingOrderDetail);
    }

    @Transactional
    public void deleteById(Integer id) {
        orderDetailRepository.deleteById(id);
    }

    public List<OrderDetail> findByOrderId(Integer orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }

}
