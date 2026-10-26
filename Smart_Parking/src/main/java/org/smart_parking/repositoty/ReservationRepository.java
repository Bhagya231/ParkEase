package org.smart_parking.repositoty;

import org.smart_parking.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID>
{



    // Find a reservation that has not been soft-deleted
    @Query(value = """
            SELECT *
            FROM reservations r
            WHERE r.id = :reservationId
              AND r.is_deleted = false
            """, nativeQuery = true)
    Optional<Reservation> findActiveReservationById(@Param("reservationId") String reservationId);


    @Query(value = """
        SELECT COUNT(*)
            FROM Reservations r
            WHERE r.slot_id = :slotId
            And r.reservation_status = 'RESERVED'
    """, nativeQuery = true)
    long existsActiveReservationBySlotId(@Param("slotId") String slotId);




    // Get reservations belonging to a user
    @Query(value = """
            SELECT *
            FROM reservations r
            WHERE r.user_id = :userId
              AND r.is_deleted = false
            ORDER BY r.created_at DESC
            """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM reservations r
                    WHERE r.user_id = :userId
                        AND r.is_deleted = false
                    """,
            nativeQuery = true)
    Page<Reservation> findReservationsByUserId(@Param("userId") String userId, Pageable pageable);



    // Find reservations whose entry deadline has passed
    @Query(value = """
    SELECT r.*
    FROM reservations r
    WHERE r.reservation_status = 'RESERVED'
      AND r.is_deleted = false
      AND r.end_time <= :currentTime
      AND NOT EXISTS (
          SELECT 1
          FROM parking_sessions ps
          WHERE ps.reservation_id = r.id
            AND ps.is_deleted = false
            AND ps.session_status = 'ACTIVE'
            AND ps.exit_time IS NULL )
    """, nativeQuery = true)
    List<Reservation> findReservationsToExpire(@Param("currentTime") LocalDateTime currentTime);






    // Get all reservations with optional status and location filters
    @Query(value = """
        SELECT r.*
        FROM reservations r
        JOIN parking_slots ps ON ps.id = r.slot_id
        JOIN parking_floors pf ON pf.id = ps.floor_id
        WHERE r.is_deleted = false
          AND (:status IS NULL
               OR r.reservation_status = :status)
          AND (:locationId IS NULL
               OR pf.location_id = :locationId) 
        ORDER BY r.created_at DESC
        """, countQuery = """
                        SELECT COUNT(*)
                        FROM reservations r
                        JOIN parking_slots ps ON ps.id = r.slot_id
                        JOIN parking_floors pf ON pf.id = ps.floor_id
                        WHERE r.is_deleted = false
                        AND (:status Is NULL OR r.reservation_status = :Status)
                        AND (:locationId IS NULL OR pf.location_id = :locationId)
""",
            nativeQuery = true)
    Page<Reservation> findAllReservationsWithFilters(@Param("status") String status, @Param("locationId") String locationId, Pageable pageable);

    // Check overlapping reservations and active parking sessions
    @Query(value = """
        SELECT COUNT(DISTINCT r.id)
        FROM reservations r
        WHERE r.slot_id = :slotId
          AND r.is_deleted = false
          AND ((
                  r.reservation_status = 'RESERVED'
                  AND r.start_time < :endTime
                  AND r.end_time > :startTime)
              OR EXISTS (
                  SELECT 1
                  FROM parking_sessions ps
                  WHERE ps.reservation_id = r.id
                    AND ps.is_deleted = false
                    AND ps.entry_time < :endTime
                    AND (
                        ps.exit_time IS NULL
                        OR ps.exit_time > :startTime)))
        """, nativeQuery = true)
    long countOverlappingReservations(@Param("slotId") String slotId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

}
