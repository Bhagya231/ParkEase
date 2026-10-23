package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smart_parking.dto.response.VehicleResponse;
import org.smart_parking.entity.Vehicle;

@Mapper(componentModel = "spring")
public interface VehicleMapper
{

    VehicleResponse toResponse(Vehicle vehicle);
}
