package org.do_an.be.repository;

import org.do_an.be.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {
}