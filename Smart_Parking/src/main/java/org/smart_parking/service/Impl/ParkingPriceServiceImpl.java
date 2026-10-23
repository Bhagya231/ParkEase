package org.smart_parking.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingPriceRequest;
import org.smart_parking.dto.response.ParkingPriceResponse;
import org.smart_parking.entity.ParkingLocation;
import org.smart_parking.entity.ParkingPrice;
import org.smart_parking.enums.VehicleType;
import org.smart_parking.mappers.ParkingPriceMapper;
import org.smart_parking.repositoty.ParkingLocationRepository;
import org.smart_parking.repositoty.ParkingPriceRepository;
import org.smart_parking.service.api.ParkingPriceService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParkingPriceServiceImpl implements ParkingPriceService
{

    private static final Logger log = AppLogger.getLogger(ParkingPriceServiceImpl.class);

    private final ParkingPriceRepository parkingPriceRepository;
    private final ParkingLocationRepository parkingLocationRepository;
    private final ParkingPriceMapper parkingPriceMapper;



    @Override
    @Transactional
    public ParkingPriceResponse createPrice(UUID locationId, ParkingPriceRequest request)
    {

        log.info("Creating parking price for location: {}", locationId);

        try {
            ParkingLocation location = parkingLocationRepository.findLocationById(locationId.toString())
                    .orElseThrow(() ->
                    {
                        log.warn("Parking location not found {}", locationId);
                        return new EntityNotFoundException("Parking location not found: " + locationId);
                    });

            long exists = parkingPriceRepository.existsActivePriceForVehicleType(locationId.toString(), request.getVehicleType().name());

            if (exists > 0) {
                log.warn("Pricing already exists for this vehicle type {} at this location {}", request.getVehicleType(),locationId);
                throw new IllegalArgumentException("Pricing already exists for this vehicle type at this location");

            }

            ParkingPrice parkingPrice = new ParkingPrice();
            parkingPrice.setLocation(location);
            parkingPrice.setVehicleType(request.getVehicleType());
            parkingPrice.setHourPrice(request.getHourPrice());
            parkingPrice.setOverstayPrice(request.getOverstayPrice());

            ParkingPrice savedPrice = parkingPriceRepository.save(parkingPrice);

            log.info("Parking price created successfully: {}", savedPrice.getId());

            return parkingPriceMapper.toResponse(savedPrice);

        } catch (RuntimeException e) {
            log.error("Failed to create parking price for location: {}", locationId, e);
            throw e;
        }
    }


    @Override
    @Transactional(readOnly = true)
    public Page<ParkingPriceResponse> getPricesByLocation(UUID locationId, Pageable pageable)
    {

        log.info("Fetching parking prices for location: {}", locationId);

        try {

            if (parkingLocationRepository.existsByLocationId(locationId.toString()) == 0)
            {
                log.warn("Parking location not found: " + locationId);
                throw new EntityNotFoundException("Parking location not found: " + locationId);
            }

//            List<ParkingPrice> entities = parkingPriceRepository.findPricesByLocationId(locationId.toString());
//            List<ParkingPriceResponse> responses = new ArrayList<>();
//
//            for (ParkingPrice entity : entities) {
//                responses.add(parkingPriceMapper.toResponse(entity));
//            }





            return parkingPriceRepository.findPricesByLocationId(locationId.toString(),pageable).map(parkingPriceMapper::toResponse) ;

        }catch (EntityNotFoundException e)
        {
            log.warn("error while fetching the price by location {} : {}",locationId, e.getMessage());
            throw e;
        }
        catch (RuntimeException e) {
            log.error("Failed to fetch parking prices for location: {}", locationId, e);
            throw e;
        }
    }


    @Override
    public Page<ParkingPriceResponse> getAllActivePrices(Pageable pageable) {
        try {
            log.info("Fetching all active parking prices");

            return parkingPriceRepository.findAllActivePrices(pageable).map(parkingPriceMapper::toResponse);
        } catch (Exception exception) {
            log.error("Failed to fetch all active parking prices", exception);

            throw exception;
        }
    }


    @Override
    @Transactional(readOnly = true)
    public ParkingPriceResponse getPriceById(UUID pricingId)
    {

        log.info("Fetching parking price: {}", pricingId);

        try {
            ParkingPrice parkingPrice = parkingPriceRepository.findPriceById(pricingId.toString())
                    .orElseThrow(() ->
                    {
                        log.warn("Parking price not found {}" , pricingId);
                        return new EntityNotFoundException("Parking price not found: " + pricingId);
                    });

            return parkingPriceMapper.toResponse(parkingPrice);

        }catch (EntityNotFoundException e)
        {
            log.error("error while fetching the prices by id {}",pricingId,e);
            throw e;
        }
        catch (RuntimeException e)
        {
            log.error("Failed to fetch parking price: {}", pricingId, e);
            throw e;
        }
    }



    @Override
    @Transactional
    public ParkingPriceResponse updatePrice(UUID pricingId,ParkingPriceRequest request)
    {

        log.info("Updating parking price: {}", pricingId);

        try {

            ParkingPrice parkingPrice = parkingPriceRepository.findPriceById(pricingId.toString())
                    .orElseThrow(() -> {
                        log.warn("Parking price not found: " + pricingId);
                        return new EntityNotFoundException("Parking price not found: " + pricingId);
                    });




            VehicleType newVehicleType = request.getVehicleType();

            if (parkingPrice.getVehicleType() != newVehicleType)
            {
                long exists = parkingPriceRepository.existsActivePriceForVehicleType(parkingPrice.getLocation().getId().toString(), newVehicleType.name());

                if (exists > 0)
                {
                    log.warn("pricing already exist for this vehicle type {} at this location {}",newVehicleType,parkingPrice.getLocation().getLocationName());
                    throw new IllegalArgumentException("Pricing already exists for this vehicle type at this location");
                }
            }

            parkingPrice.setVehicleType(newVehicleType);
            parkingPrice.setHourPrice(request.getHourPrice());
            parkingPrice.setOverstayPrice(request.getOverstayPrice());

            ParkingPrice updatedPrice = parkingPriceRepository.save(parkingPrice);

            log.info("Parking price updated successfully: {}", pricingId);

            return parkingPriceMapper.toResponse(updatedPrice);

        } catch (EntityNotFoundException | IllegalArgumentException e)
        {
            log.error("error while updating the prices {} for location ",pricingId);
            throw e;
        }
        catch (RuntimeException e) {
            log.error("Failed to update parking price: {}", pricingId, e);
            throw e;
        }
    }





}
