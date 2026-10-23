package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smart_parking.dto.response.ParkingPriceResponse;
import org.smart_parking.entity.ParkingPrice;


@Mapper(componentModel = "spring")
public interface ParkingPriceMapper
{
    @Mapping(source = "location.id", target = "locationId")
    @Mapping(source = "location.locationName", target = "locationName")
    ParkingPriceResponse toResponse(ParkingPrice parkingPrice);
}
