package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smart_parking.dto.response.ParkingSlotResponse;
import org.smart_parking.entity.ParkingSlots;

@Mapper(componentModel = "spring")
public interface ParkingSlotMapper
{
    @Mapping(source = "floor.id", target = "floorId")
    @Mapping(source = "floor.floorName", target = "floorName")
    @Mapping(source = "floor.location.id", target = "locationId")
    @Mapping(source = "floor.location.locationName", target = "locationName")
    ParkingSlotResponse toResponse(ParkingSlots slot);
}
