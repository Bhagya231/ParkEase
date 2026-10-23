package org.smart_parking.facade.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingPriceRequest;
import org.smart_parking.dto.response.ParkingPriceResponse;
import org.smart_parking.facade.api.ParkingPriceFacade;
import org.smart_parking.service.api.ParkingPriceService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;


@Component
@RequiredArgsConstructor
public class ParkingPriceFacadeImpl implements ParkingPriceFacade
{

    private static final Logger log = AppLogger.getLogger(ParkingPriceFacadeImpl.class);

    private final ParkingPriceService parkingPriceService;


    @Override
    public ParkingPriceResponse createPrice(UUID locationId, ParkingPriceRequest request)
    {

        log.info("Facade: Creating parking price for location: {}", locationId);

        try {

            return parkingPriceService.createPrice(locationId, request);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to create parking price for location: {}",locationId,e);
            throw e;


        }
    }

    @Override
    public Page<ParkingPriceResponse> getPriceByLocation(UUID locationId, Pageable pageable)
    {

        log.info("Facade: Fetching prices for location: {}", locationId);

        try {
            return parkingPriceService.getPricesByLocation(locationId,pageable);

        } catch (RuntimeException e) {
            log.error( "Facade: Failed to fetch prices for location: {}",locationId,e);

            throw e;
        }
    }

    @Override
    public Page<ParkingPriceResponse> getAllActivePrices(Pageable pageable)
    {
        log.info("facade : fetching the all prices  ");

        try {
            return  parkingPriceService.getAllActivePrices(pageable);
        }catch (RuntimeException e) {
            log.error( "Facade: Failed to fetch all  prices ",e);

            throw e;
        }

    }


    @Override
    public ParkingPriceResponse getPriceById(UUID pricingId)
    {

        log.info("Facade: Fetching parking price: {}", pricingId);

        try {
            return parkingPriceService.getPriceById(pricingId);
        } catch (RuntimeException e) {
            log.error("Facade: Failed to fetch parking price: {}",pricingId,e);


            throw e;
        }
    }

    @Override
    public ParkingPriceResponse updatePrice(UUID pricingId, ParkingPriceRequest request)
    {

        log.info("Facade: Updating parking price: {}", pricingId);

        try {
            return parkingPriceService.updatePrice(pricingId, request);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to update parking price: {}",pricingId,e);


            throw e;
        }
    }






}
