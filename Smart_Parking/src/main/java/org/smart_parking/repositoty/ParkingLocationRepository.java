package org.smart_parking.repositoty;

import org.smart_parking.entity.ParkingLocation;
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
public interface ParkingLocationRepository  extends JpaRepository<ParkingLocation, UUID> {

    // Get all locations: active, inactive
    @Query(value = "SELECT * FROM parking_location WHERE is_deleted = false ORDER BY created_at DESC",nativeQuery = true)
    List<ParkingLocation> findAllLocations();


    // Get all active locations that are not deleted
    @Query(value = "SELECT * FROM parking_location WHERE is_deleted = false AND status = 'ACTIVE' ORDER BY Created_at DESC ", nativeQuery = true)
    List<ParkingLocation> findAllActiveLocations();



    // Get a location by ID, including inactive but not deleted
    @Query(value = "SELECT * FROM parking_location WHERE id = :id AND is_deleted = false",nativeQuery = true)
    Optional<ParkingLocation> findLocationById(@Param("id") String id);


    @Query(value = """
    SELECT COUNT(*)
    FROM parking_location
    WHERE is_deleted = false
    """, nativeQuery = true)
    long countTotalLocations();

    // Check duplicate location name among non-deleted locations

    @Query(value = "SELECT EXISTS (SELECT 1 FROM parking_location WHERE LOWER(location_name) = LOWER(:locationName) AND is_deleted = false)", nativeQuery = true)
    long existsByLocationName(@Param("locationName") String locationName);


    // Check duplicate location name when updating, excluding current location

    @Query(value = "SELECT EXISTS(SELECT 1 FROM parking_location WHERE Lower(location_name) = Lower(:locationName) AND is_deleted = false AND id <> :id)", nativeQuery = true)
    long existsByLocationNameAndId(@Param("locationName") String locationName, @Param("id") String id);


    @Query(value = """
        SELECT COUNT(*) > 0
        FROM parking_location
        WHERE id = :locationId
          AND is_deleted = false
        """, nativeQuery = true)
    long existsByLocationId(@Param("locationId") String locationId);

    // Filter by location name, area, and status with pagination

    @Query(value = """
        SELECT *
        FROM parking_location
        WHERE (
                :search IS NULL
                OR TRIM(:search) = ''
                OR LOWER(location_name) LIKE  LOWER(CONCAT('%', :search, '%'))
                OR LOWER(area) LIKE  LOWER(CONCAT('%', :search, '%')) )
          AND (
                :filter = 'ALL'
                OR (:filter = 'ACTIVE' AND status = 'ACTIVE')
                OR (:filter = 'INACTIVE'  AND status = 'INACTIVE')
              )
          AND is_deleted = false
        ORDER BY created_at DESC
        """,
            countQuery = """
                   SELECT COUNT(*)
                   FROM parking_location
                   WHERE ( :search IS NULL
                            OR TRIM(:search) = ''
                            OR LOWER(location_name) LIKE LOWER(CONCAT('%', :search,'%'))
                            OR LOWER(area) LIKE LOWER(CONCAT('%', :search , '%')))
                           AND (
                                :filter = 'ALL'
                                OR (:filter = 'ACTIVE' AND status = 'ACTIVE')
                                OR (:FILTER = 'INACTIVE' AND status = 'INACTIVE'))
                           AND is_deleted = false
                   """
            ,nativeQuery = true)
    Page<ParkingLocation> searchLocations(@Param("search") String search, @Param("filter") String filter, Pageable pageable);




}
