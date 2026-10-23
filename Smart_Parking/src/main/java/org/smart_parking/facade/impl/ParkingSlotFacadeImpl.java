package org.smart_parking.facade.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingSlotCreateRequest;
import org.smart_parking.dto.request.ParkingSlotSearchRequest;
import org.smart_parking.dto.request.ParkingSlotStatusRequest;
import org.smart_parking.dto.request.ParkingSlotUpdateRequest;
import org.smart_parking.dto.response.ParkingSlotResponse;
import org.smart_parking.facade.api.ParkingSlotFacade;
import org.smart_parking.service.api.ParkingSlotService;
import org.smart_parking.util.AppLogger;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ParkingSlotFacadeImpl implements ParkingSlotFacade
{
    private static final Logger log =  AppLogger.getLogger(ParkingSlotFacadeImpl.class);
    private final ParkingSlotService parkingSlotService;



    @Override
    public List<ParkingSlotResponse> createSlots(UUID floorId, ParkingSlotCreateRequest request)
    {

        try {
            log.info("Facade: Creating slots for floor ID: {}", floorId);

            return parkingSlotService.createSlots(floorId, request);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to create slots for floor ID: {}", floorId, e);
            throw e;
        }
    }



    @Override
    public List<ParkingSlotResponse> getSlotsByFloor(UUID floorId, ParkingSlotSearchRequest request)
    {
        try {
            log.info("Facade: Fetching slots for floor ID: {}", floorId);

            return parkingSlotService.getSlotsByFloor(floorId, request);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to fetch slots for floor ID: {}", floorId, e);
            throw e;
        }
    }




    @Override
    public ParkingSlotResponse getSlotById(UUID slotId)
    {
        try {
            log.info("Facade: Fetching slot ID: {}", slotId);

            return parkingSlotService.getSlotById(slotId);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to fetch slot ID: {}", slotId, e);
            throw e;
        }
    }



    @Override
    public ParkingSlotResponse updateSlot(UUID slotId, ParkingSlotUpdateRequest request)
    {

        try {
            log.info("Facade: Updating slot ID: {}", slotId);

            return parkingSlotService.updateSlot(slotId, request);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to update slot ID: {}", slotId, e);
            throw e;
        }
    }


    @Override
    public ParkingSlotResponse updateSlotStatus(UUID slotId, ParkingSlotStatusRequest request)
    {

        try {
            log.info("Facade: Updating status for slot ID: {}", slotId);

            return parkingSlotService.updateSlotStatus(slotId, request);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to update status for slot ID: {}", slotId, e);
            throw e;
        }
    }



    @Override
    public List<ParkingSlotResponse> getCustomerSlotsByLocationAndFloor(UUID locationId, UUID floorId, ParkingSlotSearchRequest request)
    {

        try {
            log.info("Facade: Fetching available slots for location ID: {} and floor ID: {}",locationId, floorId);

            return parkingSlotService.getCustomerSlotsByLocationAndFloor(locationId, floorId, request);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to fetch available slots for location ID: {} and floor ID: {}",locationId, floorId, e);
            throw e;
        }
    }




}
