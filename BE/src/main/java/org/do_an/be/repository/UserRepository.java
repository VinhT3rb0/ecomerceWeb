package org.do_an.be.repository;

import org.do_an.be.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Integer> {

    boolean existsByTelephone(String telephone);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

//    @Query("SELECT o FROM User o WHERE  (:keyword IS NULL OR :keyword = '' OR " +
//            "o.username LIKE %:keyword% " +
//            "OR o.address LIKE %:keyword% " +
//            "OR o.telephone LIKE %:keyword%) " +
//            "AND LOWER(o.role.name) = 'user'")
//    Page<User> findAll(@Param("keyword") String keyword, Pageable pageable);

    Optional<User> findByTelephone(String telephone);
    Optional<User> findByUsernameOrEmail(String username, String email);
}
