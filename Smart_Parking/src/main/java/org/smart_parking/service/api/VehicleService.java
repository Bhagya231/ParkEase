package org.smart_parking.service.api;

import org.smart_parking.dto.request.VehicleRequest;
import org.smart_parking.dto.response.VehicleResponse;

import java.util.List;
import java.util.UUID;


public interface VehicleService
{
    VehicleResponse createVehicle(VehicleRequest request, UUID userId);

    List<VehicleResponse> getMyVehicles(UUID userId);

    VehicleResponse getVehicleById(UUID vehicleId, UUID userId);

    VehicleResponse updateVehicle(UUID vehicleId, VehicleRequest request, UUID userId);

    void deleteVehicle(UUID vehicleId, UUID userId);
}
