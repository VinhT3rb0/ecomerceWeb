package org.do_an.be.repository;

import jakarta.persistence.criteria.CriteriaBuilder;
import org.do_an.be.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    public Role findRoleById(Integer id);
    Optional<Role> findByName(String name);
}
