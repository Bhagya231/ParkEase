package org.smart_parking.repositoty;

import org.smart_parking.entity.ParkingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParkingSessionRepository extends JpaRepository<ParkingSession, UUID>
{


    @Query(value = """
        SELECT ps.*
        FROM parking_sessions ps
        INNER JOIN reservations r ON r.id = ps.reservation_id
        WHERE ps.is_deleted = false
          AND r.is_deleted = false
          AND (:userId IS NULL OR r.user_id = :userId)
          AND (:status IS NULL OR ps.session_status = :status)
        ORDER BY ps.entry_time DESC
        """, countQuery = """
        SELECT COUNT(*)
        FROM parking_session ps
        WHERE ps.is_deleted = false
          AND (:status IS NULL OR ps.session_status = :status)
        """,nativeQuery = true)
    Page<ParkingSession> findSessions(@Param("userId") String userId, @Param("status") String status, Pageable pageable);


    // Check whether a vehicle is currently occupying the reservation's slot.
    @Query(value = """
            SELECT ps.*
            FROM parking_sessions ps
            JOIN reservations r ON r.id = ps.reservation_id
            WHERE r.slot_id = :slotId
              AND ps.is_deleted = false
              AND r.is_deleted = false
              AND ps.session_status = 'ACTIVE'
              AND ps.exit_time IS NULL
            LIMIT 1
            """, nativeQuery = true)
    Optional<ParkingSession> findActiveSessionBySlotId(@Param("slotId") String slotId);


    // Find the session associated with a reservation.
    @Query(value = """
            SELECT ps.*
            FROM parking_sessions ps
            WHERE ps.reservation_id = :reservationId
              AND ps.is_deleted = false
            LIMIT 1
            """, nativeQuery = true)
    Optional<ParkingSession> findByReservationId(@Param("reservationId") String reservationId);




    @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM parking_sessions ps
        INNER JOIN reservations r ON r.id = ps.reservation_id
        WHERE r.slot_id = :slotId
          AND ps.is_deleted = false
          AND r.is_deleted = false
          AND ps.session_status = 'ACTIVE'
          AND ps.exit_time IS NULL
    )
    """, nativeQuery = true)
    boolean existsActiveSessionBySlotId(@Param("slotId") String slotId);




    @Query(value = """
        SELECT ps.*
        FROM parking_sessions ps
        INNER JOIN reservations r ON r.id = ps.reservation_id
        WHERE ps.id = :sessionId
          AND r.user_id = :userId
          AND ps.is_deleted = false
          AND r.is_deleted = false
        LIMIT 1
        """, nativeQuery = true)
    Optional<ParkingSession> findSessionByIdAndUserId(@Param("sessionId") String sessionId,
            @Param("userId") String userId);


    @Query(value = """
    SELECT COALESCE(SUM(parking_amount), 0)
    FROM parking_sessions
    WHERE payment_status = 'SUCCESSFUL'
      AND is_deleted = false
    """, nativeQuery = true)
    BigDecimal calculateTotalRevenue();


    @Query(value = """
    SELECT COUNT(*)
    FROM parking_sessions
    WHERE session_status = 'ACTIVE'
      AND is_deleted = false
    """, nativeQuery = true)
    long countActiveSessions();



}
