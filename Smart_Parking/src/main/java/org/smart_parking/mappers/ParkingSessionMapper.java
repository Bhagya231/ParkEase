package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smart_parking.dto.response.ParkingSessionResponse;
import org.smart_parking.entity.ParkingSession;

@Mapper(componentModel = "spring")
public interface ParkingSessionMapper
{
    @Mapping(target = "reservationId", source = "reservation.id")
    @Mapping(target = "reservationNumber", source = "reservation.reservationNumber")

    @Mapping(target = "userId", source = "reservation.user.id")
    @Mapping(target = "customerName", source = "reservation.user.name")
    @Mapping(target = "customerEmail", source = "reservation.user.email")

    @Mapping(target = "vehicleId", source = "reservation.vehicle.id")
    @Mapping(target = "vehicleNumber", source = "reservation.vehicle.vehicleNumber")
    @Mapping(target = "vehicleType", source = "reservation.vehicle.vehicleType")

    @Mapping(target = "slotId", source = "reservation.slot.id")
    @Mapping(target = "slotNumber", source = "reservation.slot.slotNumber")
    @Mapping(target = "floorName", source = "reservation.slot.floor.floorName")
    @Mapping(target = "parking_amount" , source = "parkingAmount")
    @Mapping(target = "locationName", source = "reservation.slot.floor.location.locationName")
    @Mapping(target = "address", source = "reservation.slot.floor.location.address")
    ParkingSessionResponse toResponse(ParkingSession parkingSession);
}
