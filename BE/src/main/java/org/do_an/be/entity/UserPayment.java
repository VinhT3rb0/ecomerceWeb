package org.do_an.be.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user_payment")
public class UserPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "payment_type")
    private String paymentType;

    @Column(name = "provider")
    private String provider;

    @Column(name = "account_no")
    private Integer accountNo;

}