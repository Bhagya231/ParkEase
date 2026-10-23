package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.smart_parking.dto.request.ParkingLocationRequest;
import org.smart_parking.dto.response.ParkingLocationResponse;
import org.smart_parking.entity.ParkingLocation;

@Mapper(componentModel = "spring")
public interface ParkingLocationMapper
{
    ParkingLocation toEntity(ParkingLocationRequest request);

    ParkingLocationResponse toResponse(ParkingLocation location);

    void updateEntity(ParkingLocationRequest request, @MappingTarget ParkingLocation location);

}
