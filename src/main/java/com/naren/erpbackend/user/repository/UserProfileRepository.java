package com.naren.erpbackend.user.repository;

import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUsernameAndDeletedFalse(String username);

    Optional<UserProfile> findByEmailAndDeletedFalse(String email);

    boolean existsByUsernameAndDeletedFalse(String username);

    boolean existsByEmailAndDeletedFalse(String email);

    @Query("SELECT u FROM UserProfile u WHERE u.deleted = false")
    Page<UserProfile> findAllUsers(Pageable pageable);

    @Query("SELECT u FROM UserProfile u " +
            "WHERE u.deleted = false " +
            "AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<UserProfile> searchUsers(@Param("keyword") String keyword, Pageable pageable);

    Optional<UserProfile> findByIdAndStatusAndDeletedFalse(Long id, UserStatus status);
}
