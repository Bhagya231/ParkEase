package org.smart_parking.service.api;

import org.smart_parking.dto.request.ParkingPriceRequest;
import org.smart_parking.dto.response.ParkingPriceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParkingPriceService
{
    ParkingPriceResponse createPrice(UUID locationId, ParkingPriceRequest request);

    Page<ParkingPriceResponse> getPricesByLocation(UUID locationId, Pageable pageable);

    Page<ParkingPriceResponse> getAllActivePrices(Pageable pageable);

    ParkingPriceResponse getPriceById(UUID pricingId);

    ParkingPriceResponse updatePrice( UUID pricingId,ParkingPriceRequest request);
}
