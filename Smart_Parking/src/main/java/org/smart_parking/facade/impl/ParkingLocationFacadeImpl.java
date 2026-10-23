package org.smart_parking.facade.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.LocationStatusRequest;
import org.smart_parking.dto.request.ParkingLocationRequest;
import org.smart_parking.dto.request.ParkingLocationSearchRequest;
import org.smart_parking.dto.response.ParkingLocationResponse;
import org.smart_parking.facade.api.ParkingLocationFacade;
import org.smart_parking.service.api.ParkingLocationService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ParkingLocationFacadeImpl implements ParkingLocationFacade
{

    private static final Logger log = AppLogger.getLogger(ParkingLocationFacadeImpl.class);
    private final ParkingLocationService parkingLocationService;

    @Override
    public ParkingLocationResponse createLocation(ParkingLocationRequest request)
    {
        log.info("request reached facade for the create request for location {}",request.getLocationName());
        return parkingLocationService.createLocation(request);
    }

    @Override
    public Page<ParkingLocationResponse> getAllLocations(ParkingLocationSearchRequest request, Pageable pageable)
    {
        log.info("request reached facade layer for the get All locations ");
        return parkingLocationService.getAllLocations(request,pageable);
    }

    @Override
    public ParkingLocationResponse getLocationById(UUID id)
    {
        log.info("getting location by id reached facade layer ");
        return parkingLocationService.getLocationById(id);
    }

    @Override
    public ParkingLocationResponse updateLocation(UUID id,ParkingLocationRequest request)
    {

        return parkingLocationService.updateLocation(id, request);
    }

    @Override
    public ParkingLocationResponse updateLocationStatus(UUID id, LocationStatusRequest request)
    {
        log.info("request reached facade for the update request for location id {}",id);
        return parkingLocationService.updateLocationStatus(id,request);

    }

    @Override
    public ParkingLocationResponse getActiveLocationById(UUID id) {
        log.info("Fetching active location through facade: {}", id);
        return parkingLocationService.getActiveLocationById(id);
    }


}
