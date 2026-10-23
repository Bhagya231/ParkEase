package org.smart_parking.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.LocationStatusRequest;
import org.smart_parking.dto.request.ParkingLocationRequest;
import org.smart_parking.dto.request.ParkingLocationSearchRequest;
import org.smart_parking.dto.response.ParkingLocationResponse;
import org.smart_parking.entity.ParkingFloor;
import org.smart_parking.entity.ParkingLocation;
import org.smart_parking.entity.ParkingSlots;
import org.smart_parking.enums.SlotStatus;
import org.smart_parking.enums.Status;
import org.smart_parking.enums.VehicleType;
import org.smart_parking.mappers.ParkingLocationMapper;
import org.smart_parking.repositoty.ParkingFloorRepository;
import org.smart_parking.repositoty.ParkingLocationRepository;
import org.smart_parking.repositoty.ParkingPriceRepository;
import org.smart_parking.repositoty.ParkingSlotsRepository;
import org.smart_parking.service.api.ParkingLocationService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ParkingLocationServiceImpl implements ParkingLocationService
{
    private static final Logger log = AppLogger.getLogger(ParkingLocationServiceImpl.class);

    private final ParkingLocationRepository parkingLocationRepository;
    private final ParkingLocationMapper parkingLocationMapper;
    private final ParkingFloorRepository parkingFloorRepository;
    private final ParkingSlotsRepository parkingSlotsRepository;
    private final ParkingPriceRepository parkingPriceRepository;

    @Override
    @Transactional
    public ParkingLocationResponse createLocation(ParkingLocationRequest request)
    {

        log.info("Creating parking location: {}", request.getLocationName());

        try {

            validateOperatingHours(request);

            // Check whether a non-deleted location already has this name.
            if(parkingLocationRepository.existsByLocationName(request.getLocationName()) > 0)
            {
                log.warn("Parking location already exists: {}",request.getLocationName());

                throw new IllegalArgumentException("A parking location with this name already exists");
            }
            ParkingLocation location = parkingLocationMapper.toEntity(request);

            location.setStatus(Status.INACTIVE);

            ParkingLocation savedLocation = parkingLocationRepository.save(location);

            log.info("Parking location created successfully. ID: {}",savedLocation.getId());

            return parkingLocationMapper.toResponse(savedLocation);
        }catch (IllegalArgumentException e)
        {
            log.warn("Invalid parking location request: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error creating parking location", e);
            throw new RuntimeException("Error creating parking location",e);
        }

    }

    @Override
    public Page<ParkingLocationResponse> getAllLocations(ParkingLocationSearchRequest request, Pageable pageable)
    {

        log.info("Fetching parking locations with search={}, filter={}",request.getSearch(), request.getFilter());

        try {

            String  search = SearchValue(request.getSearch());

            String filter = SearchValue(request.getFilter());

            if(filter == null)
            {
                filter = "ALL";
            } else {
                filter = filter.toUpperCase();
            }

            if(!List.of("ALL","ACTIVE","INACTIVE").contains(filter))
            {
                log.warn("Invalid filter {}. Use ALL, ACTIVE, INACTIVE ", filter);
                throw  new IllegalArgumentException("Invalid filter. Use ALL, ACTIVE, INACTIVE ");
            }

            Page<ParkingLocation> locations =  parkingLocationRepository.searchLocations(search, filter,pageable);




            return locations.map(parkingLocationMapper::toResponse);

        }catch (IllegalArgumentException e)
        {
            log.warn("Invalid location search request: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error fetching parking locations", e);
            throw new RuntimeException("Unable to fetch the parking locations ",e);
        }

    }


    @Override
    public ParkingLocationResponse getLocationById(UUID id) {

        log.info("Fetching parking location with ID: {}", id);

        ParkingLocation location = findActiveRecord(id);

        log.info("parking location is fetched successfully by id {}",id);

        return  locationResponseWithSummary(location);
    }


    public ParkingLocationResponse updateLocation(UUID id,ParkingLocationRequest request)
    {
        log.info("Updating parking location with ID: {}",id);
        try {
            validateOperatingHours(request);

            ParkingLocation location = findActiveRecord(id);

            long name = parkingLocationRepository.existsByLocationNameAndId(request.getLocationName(),id.toString() );

            if(name > 0 )
            {
                log.warn("Another parking location already uses this name {}", request.getLocationName());
                throw new IllegalArgumentException("Another parking location already uses this name");
            }


            // Update only the fields included in the request DTO.
            parkingLocationMapper.updateEntity(request, location);

            ParkingLocation updatedLocation = parkingLocationRepository.save(location);

            log.info("Parking location updated successfully. ID: {}",updatedLocation.getId());

            return parkingLocationMapper.toResponse(updatedLocation);

        }catch (IllegalArgumentException | EntityNotFoundException e)
        {
            log.warn("Unable to update parking location {}: {}",id,e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error updating parking location with ID: {} : {}",id,e.getMessage());
            throw new RuntimeException("Unable to update the parking location",e);
        }
    }


    @Override
    @Transactional
    public ParkingLocationResponse updateLocationStatus(UUID id, LocationStatusRequest request)
    {

        log.info("Updating status for parking location: {}", id);
        try {

            ParkingLocation location = findActiveRecord(id);

            if (request.getStatus() == Status.ACTIVE)
            {
                validateLocationReadyForActivation(location);
            }

            location.setStatus(request.getStatus());

            ParkingLocation updatedLocation = parkingLocationRepository.save(location);

            log.info("Parking location status updated to {} for ID: {}",updatedLocation.getStatus(), id);


            return parkingLocationMapper.toResponse(updatedLocation);


        }catch (EntityNotFoundException | IllegalStateException e) {
            log.warn("Unable to update location status {}: {}", id, e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            log.error("Error updating parking location status: {}", id, e);
            throw e;
        }
    }





    @Override
    public ParkingLocationResponse getActiveLocationById(UUID id)
    {

        log.info("Fetching active parking location for customer: {}", id);

        try {
            ParkingLocation location = findActiveRecord(id);

            if (!Status.ACTIVE.equals(location.getStatus())) {
                log.warn("Parking location is inactive: {}", id);
                throw new EntityNotFoundException("Parking location not found");
            }

            return  locationResponseWithSummary(location);


        } catch (EntityNotFoundException e) {
            log.warn("Unable to fetch customer location {}: {}", id, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error fetching customer location: {}", id, e);
            throw new RuntimeException("Unable to fetch parking location", e);
        }
    }












    private ParkingLocation findActiveRecord(UUID id)
    {
        return parkingLocationRepository.findLocationById(id.toString())
                .orElseThrow(() -> {
                    log.warn("Parking location not found or deleted: {}",id);
                    return new EntityNotFoundException( "Parking location not found");

                });
    }









    private void validateOperatingHours(ParkingLocationRequest request)
    {
        if (request.getOpenTime() != null && request.getCloseTime() != null && !request.getCloseTime().isAfter(request.getOpenTime()))
        {
            log.warn("Closing time {} must be later than opening time {}", request.getCloseTime(),request.getOpenTime());
            throw new IllegalArgumentException("Closing time must be later than opening time");

        }
    }



    private String SearchValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }



    private void validateLocationReadyForActivation(ParkingLocation location) {

        UUID locationId = location.getId();

        //  Check whether the location has at least one floor.
        List<ParkingFloor> floors = parkingFloorRepository.findFloorsByLocationId(locationId.toString());

        if (floors.isEmpty())
        {
            log.warn("Cannot activate location {}. Create at least one floor first.",locationId);
            throw new IllegalStateException("Cannot activate location. Create at least one floor first.");
        }

        //  Check whether the location has at least one slot.
        boolean hasSlots = floors.stream().anyMatch(floor -> parkingSlotsRepository.existsByFloorId(floor.getId().toString()));


        if (!hasSlots)
        {
            log.warn("Cannot activate location. Create at least one parking slot first.");
            throw new IllegalStateException("Cannot activate location. Create at least one parking slot first.");

        }

        //  Check that pricing exists for every vehicle type used by its slots.
        List<VehicleType> vehicleTypes = parkingSlotsRepository.findVehicleTypesByLocationId(locationId.toString());

        for (VehicleType vehicleType : vehicleTypes) {

            long priceExists = parkingPriceRepository.existsActivePriceForVehicleType(locationId.toString(), vehicleType.name());

            if (priceExists == 0)
            {
                throw new IllegalStateException("Cannot activate location. Configure pricing for vehicle type: "+ vehicleType);


            }
        }

        log.info("Location setup validation passed for location: {}", locationId);
    }



    private ParkingLocationResponse locationResponseWithSummary(ParkingLocation location)
    {
        ParkingLocationResponse response = parkingLocationMapper.toResponse(location);

        String locationId = location.getId().toString();

        //Count active floors at this location
        long floorCount = parkingFloorRepository.countActiveFloorsByLocation(locationId.toString());

        //fetch non - deleted slots on active floors in one query
        List<ParkingSlots> slots = parkingSlotsRepository.findSlotsByActiveFloorsAtLocation(locationId);

        response.setFloorCount(floorCount);
        response.setTotalSlots(slots.size());

        long availableSlots = slots.stream().filter(slot ->  SlotStatus.AVAILABLE.equals(slot.getSlotStatus())).count();

        response.setAvailableSlots(availableSlots);

        // CAR counts
        setVehicleSlotCounts(response, slots, VehicleType.CAR);

        // BIKE counts
        setVehicleSlotCounts(response, slots, VehicleType.BIKE);

        // EV counts
        setVehicleSlotCounts(response, slots, VehicleType.EV);

        return response;

    }


    private void setVehicleSlotCounts(ParkingLocationResponse response, List<ParkingSlots> slots, VehicleType vehicleType)
    {

        List<ParkingSlots> vehicleSlots = slots.stream().filter(slot -> vehicleType.equals(slot.getVehicleType())).toList();

        long total = vehicleSlots.size();

        long available = vehicleSlots.stream().filter(slot -> SlotStatus.AVAILABLE.equals(slot.getSlotStatus())).count();

        switch (vehicleType) {
            case CAR -> {
                response.setTotalCarSlots(total);
                response.setAvailableCarSlots(available);
            }
            case BIKE -> {
                response.setTotalBikeSlots(total);
                response.setAvailableBikeSlots(available);
            }
            case EV -> {
                response.setTotalEvSlots(total);
                response.setAvailableEvSlots(available);
            }
        }
    }




}
