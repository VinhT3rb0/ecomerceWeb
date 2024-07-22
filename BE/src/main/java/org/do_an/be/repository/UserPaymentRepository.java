package org.do_an.be.repository;

import org.do_an.be.entity.UserPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPaymentRepository extends JpaRepository<UserPayment, Integer> {
}