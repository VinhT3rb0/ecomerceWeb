package org.do_an.be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Entity
@Data
@Table(name = "product_details")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @NotNull
    @Column(name = "ram", nullable = false)
    private Integer ram;

    @Size(max = 255)
    @NotNull
    @Column(name = "cpu", nullable = false)
    private String cpu;

    @Size(max = 255)
    @NotNull
    @Column(name = "display", nullable = false)
    private String display;

    @Size(max = 255)
    @Column(name = "vga", nullable = false)
    private String vga;

    @Size(max = 255)
    @NotNull
    @Column(name = "drive", nullable = false)
    private String drive;

    @Size(max = 255)
    @Column(name = "battery", nullable = false)
    private String battery;

    @Size(max = 255)
    @Column(name = "front_camera", nullable = false)
    private String frontCamera;

    @Size(max = 255)
    @Column(name = "behind_camera", nullable = false)
    private String behindCamera;
}