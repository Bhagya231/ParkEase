package org.smart_parking.facade.api;

import org.smart_parking.dto.request.ParkingPriceRequest;
import org.smart_parking.dto.response.ParkingPriceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParkingPriceFacade
{
    ParkingPriceResponse createPrice(UUID locationId, ParkingPriceRequest request);

    Page<ParkingPriceResponse> getPriceByLocation(UUID locationId, Pageable pageable);

    ParkingPriceResponse getPriceById(UUID pricingId);

    Page<ParkingPriceResponse> getAllActivePrices(Pageable pageable);

    ParkingPriceResponse updatePrice(UUID pricingId, ParkingPriceRequest request);
}
