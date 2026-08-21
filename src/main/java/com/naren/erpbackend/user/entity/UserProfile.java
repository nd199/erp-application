package com.naren.erpbackend.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "user_profile",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_profile_username", columnNames = "user_name"
                ),
                @UniqueConstraint(
                        name = "uk_user_profile_email", columnNames = "email"
                )
        })
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class UserProfile {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false, length = 50)
    private String username;

    @Column(name = "email", nullable = false, length = 254)
    private String email;

    @Column(name = "password", nullable = false, length = 60)
    private String password;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "address", length = 254)
    private String address;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name = "last_updated", nullable = false)
    @LastModifiedDate
    private Instant lastUpdated;

}
