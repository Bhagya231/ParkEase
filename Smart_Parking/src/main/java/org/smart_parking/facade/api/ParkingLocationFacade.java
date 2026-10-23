package org.smart_parking.facade.api;

import org.smart_parking.dto.request.LocationStatusRequest;
import org.smart_parking.dto.request.ParkingLocationRequest;
import org.smart_parking.dto.request.ParkingLocationSearchRequest;
import org.smart_parking.dto.response.ParkingLocationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParkingLocationFacade
{

    ParkingLocationResponse createLocation(ParkingLocationRequest request);

    Page<ParkingLocationResponse> getAllLocations(ParkingLocationSearchRequest request, Pageable pageable);

    ParkingLocationResponse getLocationById(UUID id);

    ParkingLocationResponse updateLocation(UUID id, ParkingLocationRequest request);

    ParkingLocationResponse updateLocationStatus(UUID id, LocationStatusRequest request);

    ParkingLocationResponse getActiveLocationById(UUID id);
}
