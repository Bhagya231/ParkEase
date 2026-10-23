package org.smart_parking.repositoty;

import org.smart_parking.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID>
{

    @Query(value = """
            SELECT *
            FROM vehicles
            WHERE id = :vehicleId
              AND user_id = :userId
              AND is_deleted = false
            LIMIT 1
            """, nativeQuery = true)
    Optional<Vehicle> findVehicleByIdAndUserId(@Param("vehicleId") String vehicleId, @Param("userId") String userId);



    @Query(value = """
        SELECT EXISTS (
            SELECT 1
            FROM vehicles
            WHERE vehicle_number = :vehicleNumber
              AND is_deleted = false)
        """, nativeQuery = true)
    int existedByVehicleNumber(@Param("vehicleNumber") String vehicleNumber);


    // Get all active vehicles belonging to a specific user
    @Query(value = """
            SELECT *
            FROM vehicles
            WHERE user_id = :userId
              AND is_deleted = false
            ORDER BY created_at DESC
            """, nativeQuery = true)
    List<Vehicle> findAllActiveVehiclesByUserId(@Param("userId") String userId);


}
