package org.do_an.be.responses.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.do_an.be.entity.Order;
import org.do_an.be.entity.Role;
import org.do_an.be.entity.User;
import org.do_an.be.entity.UserAddress;
import org.do_an.be.repository.RoleRepository;
import org.do_an.be.repository.UserRepository;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor

@Builder
public class UserResponse {

    @JsonProperty("id")
    private Integer id;

    private String telephone;
    private String username;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("address")
    private UserAddress address;
    private String email;

    @JsonProperty("profile_image")
    private String profileImage;



    @JsonProperty("roles")
    private Set<String> roles;
    private List<Order> orders;
    public static UserResponse fromUser(User user) {

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            System.out.println("User has no roles assigned.");
        } else {
            System.out.println("User Roles: " + user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        }
        return UserResponse.builder()
                .id(user.getId())
                .telephone(user.getTelephone())
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .roles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()))
                .email(user.getEmail())
                .address(user.getAddress())
                .fullName(user.getFullName())

                .build();
    }
}
