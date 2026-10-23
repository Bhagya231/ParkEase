package org.smart_parking.repositoty;

import org.smart_parking.entity.ParkingPrice;
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
public interface ParkingPriceRepository extends JpaRepository<ParkingPrice, UUID>
{
    // Get paginated, non-deleted prices for a location.
    @Query(
            value = """
        SELECT *
        FROM parking_pricing
        WHERE location_id = :locationId
          AND is_deleted = false
        ORDER BY created_at DESC
        """,
            countQuery = """
        SELECT COUNT(*)
        FROM parking_pricing
        WHERE location_id = :locationId
          AND is_deleted = false
        """, nativeQuery = true)
    Page<ParkingPrice> findPricesByLocationId(@Param("locationId") String locationId, Pageable pageable);



    @Query(value = "SELECT * FROM parking_pricing WHERE id = :id AND is_deleted = false LIMIT 1", nativeQuery = true)
    Optional<ParkingPrice> findPriceById(@Param("id") String id);


    @Query(value = """
            SELECT EXISTS (
                SELECT 1
                FROM parking_pricing
                WHERE location_id = :locationId
                  AND vehicle_type = :vehicleType
                  AND is_deleted = false)""", nativeQuery = true)
    long existsActivePriceForVehicleType(@Param("locationId") String locationId, @Param("vehicleType") String vehicleType);


    @Query(value = """ 
            SELECT *
            FROM parking_pricing
            WHERE location_id = :locationId
              AND vehicle_type = :vehicleType
              AND is_deleted = false
            LIMIT 1
            """, nativeQuery = true)
    Optional<ParkingPrice> findPriceByLocationAndVehicleType(@Param("locationId") String locationId,
            @Param("vehicleType") String vehicleType);



    @Query(
            value = """
        SELECT *
        FROM parking_pricing
        WHERE is_deleted = false
        ORDER BY created_at DESC
        """,
            countQuery = """
        SELECT COUNT(*)
        FROM parking_pricing
        WHERE is_deleted = false
        """,
            nativeQuery = true
    )
    Page<ParkingPrice> findAllActivePrices(Pageable pageable);


}
