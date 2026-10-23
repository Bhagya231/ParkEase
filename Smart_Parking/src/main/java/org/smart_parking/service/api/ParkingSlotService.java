package org.smart_parking.service.api;

import org.smart_parking.dto.request.ParkingSlotCreateRequest;
import org.smart_parking.dto.request.ParkingSlotSearchRequest;
import org.smart_parking.dto.request.ParkingSlotStatusRequest;
import org.smart_parking.dto.request.ParkingSlotUpdateRequest;
import org.smart_parking.dto.response.ParkingSlotResponse;

import java.util.List;
import java.util.UUID;

public interface ParkingSlotService
{
    //  create multiple slots under a floor
    List<ParkingSlotResponse> createSlots(UUID floorId, ParkingSlotCreateRequest request);

    //  get all non-deleted slots under a floor with optional filters
    List<ParkingSlotResponse> getSlotsByFloor(UUID floorId, ParkingSlotSearchRequest request);


    ParkingSlotResponse getSlotById(UUID slotId);

    //  update slot number and configuration
    ParkingSlotResponse updateSlot(UUID slotId, ParkingSlotUpdateRequest request);


    //  change slot status
    ParkingSlotResponse updateSlotStatus(UUID slotId,ParkingSlotStatusRequest request);

    //  get available slots under a location and floor
    List<ParkingSlotResponse> getCustomerSlotsByLocationAndFloor(UUID locationId,UUID floorId,ParkingSlotSearchRequest request);






}
