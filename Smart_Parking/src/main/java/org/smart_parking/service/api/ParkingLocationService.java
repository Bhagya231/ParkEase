package org.smart_parking.service.api;

import org.smart_parking.dto.request.LocationStatusRequest;
import org.smart_parking.dto.request.ParkingLocationRequest;
import org.smart_parking.dto.request.ParkingLocationSearchRequest;
import org.smart_parking.dto.response.ParkingLocationResponse;
import org.smart_parking.entity.ParkingLocation;
import org.smart_parking.entity.ParkingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParkingLocationService
{
    ParkingLocationResponse createLocation(ParkingLocationRequest request);

    Page<ParkingLocationResponse> getAllLocations(ParkingLocationSearchRequest request, Pageable pageable);

    ParkingLocationResponse getLocationById(UUID id);

    ParkingLocationResponse updateLocation(UUID id, ParkingLocationRequest request);

    ParkingLocationResponse updateLocationStatus(UUID id, LocationStatusRequest request);

    ParkingLocationResponse getActiveLocationById(UUID id);
}
