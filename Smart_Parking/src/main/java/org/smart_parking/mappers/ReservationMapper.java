package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smart_parking.dto.response.ReservationResponse;
import org.smart_parking.entity.Reservation;

@Mapper(componentModel = "spring")
public interface ReservationMapper
{

    @Mapping(source = "slot.floor.location.id", target = "locationId")
    @Mapping(source = "slot.floor.location.locationName", target = "locationName")
    @Mapping(source = "slot.floor.id", target = "floorId")
    @Mapping(source = "slot.floor.floorName", target = "floorName")
    @Mapping(source = "slot.id", target = "slotId")
    @Mapping(source = "slot.slotNumber", target = "slotNumber")
    @Mapping(source = "vehicle.id", target = "vehicleId")
    @Mapping(source = "vehicle.vehicleNumber", target = "vehicleNumber")
    @Mapping(source = "vehicle.vehicleType", target = "vehicleType")
    ReservationResponse toResponse(Reservation reservation);

}
