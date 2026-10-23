package org.smart_parking.service.api;

import org.smart_parking.dto.request.ParkingFloorRequest;
import org.smart_parking.dto.request.ParkingFloorStatusRequest;
import org.smart_parking.dto.response.ParkingFloorResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParkingFloorService
{
    ParkingFloorResponse createFloor(UUID locationId, ParkingFloorRequest request);

    List<ParkingFloorResponse> getFloorsByLocation(UUID locationId);

    ParkingFloorResponse getFloorById(UUID id);

    Page<ParkingFloorResponse> getAllFloors(Pageable pageable);

    ParkingFloorResponse updateFloor( UUID id,ParkingFloorRequest request);

    ParkingFloorResponse updateFloorStatus(UUID id, ParkingFloorStatusRequest request);

    List<ParkingFloorResponse> getActiveFloorsByLocation(UUID locationId);
    ParkingFloorResponse getActiveFloorById(UUID id);
}
