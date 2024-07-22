package org.do_an.be.repository;

import org.do_an.be.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository< UserAddress ,Integer> {

}
