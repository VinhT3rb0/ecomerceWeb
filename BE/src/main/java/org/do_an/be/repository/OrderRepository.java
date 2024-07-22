package org.do_an.be.repository;

import org.do_an.be.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(Long userId);
    @Query("SELECT o FROM Order o WHERE  (:keyword IS NULL OR :keyword = '' OR " +
            "o.fullName LIKE %:keyword% " +
            "OR o.address LIKE %:keyword% " +
            "OR o.note LIKE %:keyword% " +
            "OR o.email LIKE %:keyword%) " +
            "ORDER BY o.orderDate DESC")
    Page<Order> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}