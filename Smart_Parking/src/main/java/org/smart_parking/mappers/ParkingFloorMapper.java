package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smart_parking.dto.response.ParkingFloorResponse;
import org.smart_parking.entity.ParkingFloor;

@Mapper(componentModel = "spring")
public interface ParkingFloorMapper
{
    @Mapping(source = "location.id", target = "locationId")
    @Mapping(source = "location.locationName" , target = "locationName")
    ParkingFloorResponse toResponse(ParkingFloor parkingFloor);
}
