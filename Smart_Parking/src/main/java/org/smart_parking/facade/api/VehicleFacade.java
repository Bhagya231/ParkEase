package org.smart_parking.facade.api;

import org.smart_parking.dto.request.VehicleRequest;
import org.smart_parking.dto.response.VehicleResponse;

import java.util.List;
import java.util.UUID;

public interface VehicleFacade
{
    VehicleResponse createVehicle(VehicleRequest request);

    List<VehicleResponse> getMyVehicles();

    VehicleResponse getVehicleById(UUID vehicleId);

    VehicleResponse updateVehicle(UUID vehicleId, VehicleRequest request);

    void deleteVehicle(UUID vehicleId);
}
