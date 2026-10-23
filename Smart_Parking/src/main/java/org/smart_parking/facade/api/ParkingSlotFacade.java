package org.smart_parking.facade.api;

import org.smart_parking.dto.request.ParkingSlotCreateRequest;
import org.smart_parking.dto.request.ParkingSlotSearchRequest;
import org.smart_parking.dto.request.ParkingSlotStatusRequest;
import org.smart_parking.dto.request.ParkingSlotUpdateRequest;
import org.smart_parking.dto.response.ParkingSlotResponse;

import java.util.List;
import java.util.UUID;

public interface ParkingSlotFacade
{
    List<ParkingSlotResponse> createSlots(UUID floorId, ParkingSlotCreateRequest request);


    List<ParkingSlotResponse> getSlotsByFloor(UUID floorId, ParkingSlotSearchRequest request);

    ParkingSlotResponse getSlotById(UUID slotId);

    ParkingSlotResponse updateSlot(UUID slotId,ParkingSlotUpdateRequest request);

    ParkingSlotResponse updateSlotStatus(UUID slotId,ParkingSlotStatusRequest request);

    List<ParkingSlotResponse> getCustomerSlotsByLocationAndFloor(UUID locationId,UUID floorId, ParkingSlotSearchRequest request);




}
