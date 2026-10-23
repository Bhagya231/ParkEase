package org.smart_parking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.PaymentStatus;
import org.smart_parking.enums.SessionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "parking_sessions")
public class ParkingSession extends BaseEntity
{

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    private Reservation reservation;


    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "normal_amount", precision = 10, scale = 2)
    private BigDecimal normalAmount;

    @Column(name = "overstay_amount", precision = 10, scale = 2)
    private BigDecimal overstayAmount;

    @Column(name = "parking_amount", precision = 10, scale = 2)
    private BigDecimal parkingAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionStatus sessionStatus;

}
