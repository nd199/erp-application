package com.naren.erpbackend.user.repository;

import com.naren.erpbackend.user.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);

    boolean existsByName(String name);

    @Query("SELECT r FROM Role r WHERE " +
            "LOWER(r.name) LIKE CONCAT( '%', :keyword, '%')" +
            "OR LOWER(r.description) LIKE CONCAT( '%', :keyword, '%')")
    Page<Role> searchRoles(String keyword, Pageable pageable);
}
