package org.smart_parking.repositoty;

import org.smart_parking.entity.ParkingSlots;
import org.smart_parking.enums.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingSlotsRepository extends JpaRepository<ParkingSlots, UUID>
{


    @Query(value = """
        SELECT COUNT(*) 
        FROM parking_slots
        WHERE floor_id = :floorId
          AND is_deleted = false
        """, nativeQuery = true)
    long existsByFloorId(@Param("floorId") String floorId);

    @Query(value = """
        SELECT EXISTS (
            SELECT 1
            FROM parking_slots
            WHERE floor_id = :floorId
              AND LOWER(slot_number) = LOWER(:slotNumber)
              AND is_deleted = false
        )
        """, nativeQuery = true)
    long existsByFloorAndSlotNumber(@Param("floorId") String floorId, @Param("slotNumber") String slotNumber);

    // Check duplicates when updating a slot, excluding its own ID.
    @Query(value = """
            SELECT EXISTS (
                SELECT 1
                FROM parking_slots
                WHERE floor_id = :floorId
                  AND LOWER(slot_number) = LOWER(:slotNumber)
                  AND id <> :slotId
                  AND is_deleted = false
            )
            """, nativeQuery = true)
    long existsByFloorAndSlotNumberAndIdNot(@Param("floorId") String floorId,
            @Param("slotNumber") String slotNumber,
            @Param("slotId") String slotId);

    // Get a non-deleted slot by ID.
    @Query(value = """
            SELECT *
            FROM parking_slots
            WHERE id = :slotId
              AND is_deleted = false
            """, nativeQuery = true)
    Optional<ParkingSlots> findActiveSlotById(@Param("slotId") String slotId);


    // Get all non-deleted slots on a floor, including every status.
    @Query(value = """
            SELECT *
            FROM parking_slots
            WHERE floor_id = :floorId
              AND is_deleted = false
            ORDER BY slot_number ASC
            """, nativeQuery = true)
    List<ParkingSlots> findSlotsByFloor(@Param("floorId") String floorId);

    // Count all non-deleted slots belonging to a floor.
    @Query(value = """
        SELECT COUNT(*)
        FROM parking_slots
        WHERE floor_id = :floorId
          AND is_deleted = false
        """, nativeQuery = true)
    long countTotalSlotsByFloorId(@Param("floorId") String floorId);


    // Count available, non-deleted slots belonging to a floor.
    @Query(value = """
        SELECT COUNT(*)
        FROM parking_slots
        WHERE floor_id = :floorId
          AND slot_status = 'AVAILABLE'
          AND is_deleted = false
        """, nativeQuery = true)
    long countAvailableSlotsByFloorId(@Param("floorId") String floorId);



    @Query(value = """
        SELECT DISTINCT ps.vehicle_type
        FROM parking_slots ps
        JOIN parking_floors pf ON ps.floor_id = pf.id
        WHERE pf.location_id = :locationId
          AND ps.is_deleted = false
          AND pf.is_deleted = false
        """, nativeQuery = true)
    List<VehicleType> findVehicleTypesByLocationId(@Param("locationId") String locationId);



    // Search non-deleted slots by floor and optional filters.
    @Query(value = """
            SELECT *
            FROM parking_slots
            WHERE floor_id = :floorId
              AND is_deleted = false
              AND (:sectionName IS NULL OR LOWER(section_name) = LOWER(:sectionName))
              AND (:vehicleType IS NULL OR vehicle_type = :vehicleType)
              AND (:slotType IS NULL OR slot_type = :slotType)
              AND (:slotStatus IS NULL OR slot_status = :slotStatus)
            ORDER BY section_name ASC, slot_number ASC
            """, nativeQuery = true)
    List<ParkingSlots> searchSlotsByFloor(@Param("floorId") String floorId,
            @Param("sectionName") String sectionName,
            @Param("vehicleType") String vehicleType,
            @Param("slotType") String slotType,
            @Param("slotStatus") String slotStatus);



    @Query(value = """
    SELECT COUNT(*)
    FROM parking_slots
    WHERE slot_status = 'AVAILABLE'
      AND is_deleted = false
    """, nativeQuery = true)
    long countAvailableSlots();

    @Query(value = """
    SELECT COUNT(*)
    FROM parking_slots
    WHERE slot_status = 'OCCUPIED'
      AND is_deleted = false
    """, nativeQuery = true)
    long countOccupiedSlots();




    // Get all active slots for the customer's selected location and floor.
    @Query(value = """
    SELECT ps.*
    FROM parking_slots ps
    INNER JOIN parking_floors pf ON ps.floor_id = pf.id
    INNER JOIN parking_location pl ON pf.location_id = pl.id
    WHERE pl.id = :locationId
      AND pf.id = :floorId
      AND ps.is_deleted = false
      AND pf.is_deleted = false
      AND pf.status = 'ACTIVE'
      AND pl.is_deleted = false
      AND pl.status = 'ACTIVE'
      AND (:vehicleType IS NULL OR ps.vehicle_type = :vehicleType)
      AND (:slotType IS NULL OR ps.slot_type = :slotType)
      AND (:sectionName IS NULL
           OR LOWER(ps.section_name) = LOWER(:sectionName))
    ORDER BY ps.section_name ASC, ps.slot_number ASC
    """, nativeQuery = true)
    List<ParkingSlots> findCustomerSlotsByLocationAndFloor(@Param("locationId") String locationId, @Param("floorId") String floorId, @Param("vehicleType") String vehicleType,
            @Param("slotType") String slotType,
            @Param("sectionName") String sectionName);



    @Query(value = """
            SELECT ps.*
            FROM parking_slots ps 
            INNER JOIN parking_floors pf ON ps.floor_id = pf.id
            WHERE pf.location_id = :locationId
                AND pf.status = "ACTIVE"
                AND pf.is_deleted = false
                AND ps.is_deleted = false
            ORDER BY pf.floor_number ASC, ps.slot_number ASC
                """,nativeQuery = true)
    List<ParkingSlots> findSlotsByActiveFloorsAtLocation(@Param("locationId") String locationId);



}

