package org.do_an.be.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "discount")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "`desc`")
    private String desc;

    @Column(name = "discount_percent", precision = 10)
    private BigDecimal discountPercent;

    @Column(name = "active")
    private Boolean active;



}