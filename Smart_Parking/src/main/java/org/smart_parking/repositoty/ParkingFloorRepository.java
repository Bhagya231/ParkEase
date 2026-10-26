package org.smart_parking.repositoty;

import org.smart_parking.entity.ParkingFloor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingFloorRepository extends JpaRepository<ParkingFloor, UUID>
{

    // Get all non-deleted floors belonging to a location
    @Query(value = """
             SELECT *
             FROM parking_floors
             WHERE location_id = :locationId
             AND is_deleted = false  AND status = "ACTIVE"
             ORDER BY floor_number ASC
              """, nativeQuery = true)
    List<ParkingFloor> findFloorsByLocationId(@Param("locationId") String locationId);


    @Query(value = """
             SELECT *
             FROM parking_floors
             WHERE location_id = :locationId
             AND is_deleted = false  
             ORDER BY floor_number ASC
              """, nativeQuery = true)
    List<ParkingFloor> findFloorsLocationId(@Param("locationId") String locationId);


    // Get all non-deleted floors across all locations, newest first
    @Query(value = """
        SELECT *
        FROM parking_floors
        WHERE is_deleted = false
        ORDER BY created_at DESC
        """, countQuery = """ 
            SELECT COUNT(*)
            FROM parking_floors
            WHERE is_deleted = false"""
    ,nativeQuery = true)
    Page<ParkingFloor> findAllFloors(Pageable pageable);




    // Get active floors belonging to an active, non-deleted location
    @Query(value = """
        SELECT COUNT(*)
        FROM parking_floors f
        INNER JOIN parking_location l ON l.id = f.location_id
        WHERE f.location_id = :locationId
          AND f.status = 'ACTIVE'
          AND f.is_deleted = false
          AND l.is_deleted = false
        """, nativeQuery = true)
    long countFloorsByLocation(@Param("locationId") String locationId);




    // Get a floor by ID, excluding deleted floors
    @Query(value = """
            SELECT *
            FROM parking_floors
            WHERE id = :id
              AND is_deleted = false
            """, nativeQuery = true)
    Optional<ParkingFloor> findFloorById(@Param("id") String id);



    // Check duplicate floor number within a location
    @Query(value = """
            SELECT EXISTS (
                SELECT 1
                FROM parking_floors
                WHERE location_id = :locationId
                  AND floor_number = :floorNumber
                  AND is_deleted = false
            )
            """, nativeQuery = true)
    long existsByLocationAndFloorNumber(@Param("locationId") String locationId, @Param("floorNumber") Integer floeerNumber);

    // Check duplicate floor number while updating, excluding current floor
    @Query(value = """
            SELECT EXISTS (
                SELECT 1
                FROM parking_floors
                WHERE location_id = :locationId
                  AND floor_number = :floorNumber
                  AND id <> :floorId
                  AND is_deleted = false
            )
            """, nativeQuery = true)
    long existsByLocationAndFloorNumberAndIdNot(@Param("locationId") String locationId,@Param("floorNumber") Integer floorNumber,
                                                   @Param("floorId") String floorId);
             
             
}
