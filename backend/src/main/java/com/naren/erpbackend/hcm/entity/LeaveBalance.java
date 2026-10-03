package com.naren.erpbackend.hcm.entity;

import com.naren.erpbackend.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "leave_balances", uniqueConstraints = {
        @UniqueConstraint(name = "uk_leave_balance", columnNames = {"employee_id", "leave_year", "leave_type"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "leave_year", nullable = false)
    private Integer year;

    @Column(name = "leave_type", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;

    @Column(name = "total_entitled", nullable = false, precision = 5, scale = 1)
    private BigDecimal totalEntitled;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "last_updated", nullable = false)
    private Instant lastUpdated;
}
