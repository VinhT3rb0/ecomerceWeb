package org.do_an.be.repository;


import org.do_an.be.entity.Role;
import org.do_an.be.entity.User;
import org.do_an.be.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findByUser(User user);
    Token findByToken(String token);
    Token findByRefreshToken(String token);
}

