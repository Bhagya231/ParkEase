package org.smart_parking.facade.impl;


import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingFloorRequest;
import org.smart_parking.dto.request.ParkingFloorStatusRequest;
import org.smart_parking.dto.response.ParkingFloorResponse;
import org.smart_parking.facade.api.ParkingFloorFacade;
import org.smart_parking.service.api.ParkingFloorService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ParkingFloorFacadeImpl implements ParkingFloorFacade
{

    private static final Logger log =  AppLogger.getLogger(ParkingFloorFacadeImpl.class);

    private final ParkingFloorService parkingFloorService;

    @Override
    public ParkingFloorResponse createFloor(UUID locationId, ParkingFloorRequest request)
    {

        log.info("Facade: Creating floor for location: {}", locationId);

        try {

            return parkingFloorService.createFloor(locationId, request);


        } catch (Exception e) {
            log.error("Facade: Failed to create floor for location: {}", locationId, e);
            throw e;
        }

    }


    @Override
    public List<ParkingFloorResponse> getFloorsByLocation(UUID locationId)
    {

        log.info("Facade: Fetching floors for location: {}", locationId);

        try {
            return parkingFloorService.getFloorsByLocation(locationId);

        } catch (Exception e) {
            log.error("Facade: Failed to fetch floors for location: {}", locationId, e);
            throw e;
        }
    }

    @Override
    public Page<ParkingFloorResponse> getAllFloors(Pageable pageable)
    {
        log.info("facade: fetching all floors ");
        try {
            return parkingFloorService.getAllFloors(pageable);
        }catch (Exception e) {
            log.error("Facade: Failed to fetch all floors  ", e);
            throw e;
        }
    }

    @Override
    public ParkingFloorResponse getFloorById(UUID floorId) {

        log.info("Facade: Fetching floor: {}", floorId);

        try {
            return parkingFloorService.getFloorById(floorId);

        } catch (Exception e) {
            log.error("Facade: Failed to fetch floor: {}", floorId, e);
            throw e;
        }
    }

    @Override
    public ParkingFloorResponse updateFloor(UUID id, ParkingFloorRequest request)
    {

        log.info("Facade: Updating floor: {}", id);

        try {
            return parkingFloorService.updateFloor(id, request);

        } catch (Exception e) {
            log.error("Facade: Failed to update floor: {}", id, e);
            throw e;
        }

    }

    @Override
    public ParkingFloorResponse updateFloorStatus(UUID id, ParkingFloorStatusRequest request)
    {

        log.info("Facade: Updating floor status: {}", id);

        try {
            return parkingFloorService.updateFloorStatus(id, request);

        } catch (Exception e) {
            log.error("Facade: Failed to update floor status: {}", id, e);
            throw e;
        }
    }


    @Override
    public List<ParkingFloorResponse> getActiveFloorsByLocation(UUID locationId)
    {

        log.info("Facade: Fetching active floors for location: {}", locationId);

        try {
            return parkingFloorService.getActiveFloorsByLocation(locationId);

        } catch (Exception e) {
            log.error("Facade: Failed to fetch active floors for location: {}", locationId, e);
            throw e;
        }
    }

    @Override
    public ParkingFloorResponse getActiveFloorById(UUID floorId) {

        log.info("Facade: Fetching active floor: {}", floorId);

        try {
            return parkingFloorService.getActiveFloorById(floorId);

        } catch (Exception e) {
            log.error("Facade: Failed to fetch active floor: {}", floorId, e);
            throw e;
        }
    }




}
