package org.smart_parking.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.smart_parking.dto.request.ParkingFloorRequest;
import org.smart_parking.dto.request.ParkingFloorStatusRequest;
import org.smart_parking.dto.response.ParkingFloorResponse;
import org.smart_parking.entity.ParkingFloor;
import org.smart_parking.entity.ParkingLocation;
import org.smart_parking.enums.Status;
import org.smart_parking.mappers.ParkingFloorMapper;
import org.smart_parking.repositoty.ParkingFloorRepository;
import org.smart_parking.repositoty.ParkingLocationRepository;
import org.smart_parking.repositoty.ParkingSlotsRepository;
import org.smart_parking.service.api.ParkingFloorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParkingFloorServiceImpl implements ParkingFloorService
{

    private static final Logger log = LoggerFactory.getLogger(ParkingFloorServiceImpl.class);

    private final ParkingFloorRepository parkingFloorRepository;
    private final ParkingLocationRepository parkingLocationRepository;
    private final ParkingFloorMapper parkingFloorMapper;
    private final ParkingSlotsRepository parkingSlotsRepository;

    @Override
    @Transactional
    public ParkingFloorResponse createFloor(UUID locationId, ParkingFloorRequest request)
    {

        log.info("Creating floor for location ID: {}", locationId);

        try {

            ParkingLocation location = getLocation(locationId);

            long floorExists =parkingFloorRepository.existsByLocationAndFloorNumber(locationId.toString(),request.getFloorNumber());

            if(floorExists > 0)
            {
                log.info("A floor with this number already exists in this location {}", locationId);
                throw new IllegalArgumentException("A floor with this number already exists in this location");

            }

            ParkingFloor floor = new ParkingFloor();
            floor.setLocation(location);
            floor.setFloorName(request.getFloorName());
            floor.setFloorNumber(request.getFloorNumber());
            floor.setStatus(Status.INACTIVE);

            ParkingFloor savedFloor = parkingFloorRepository.save(floor);

            log.info("Floor created successfully. Floor ID: {}", savedFloor.getId());

            return parkingFloorMapper.toResponse(savedFloor);


        } catch (EntityNotFoundException | IllegalArgumentException e) {
            log.error("Unable to create parking floor: {}", e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error while creating parking floor", e);
            throw e;
        }

    }

    @Override
    public List<ParkingFloorResponse> getFloorsByLocation(UUID locationId)
    {
        log.info("Fetching floors for location: {}", locationId);

        try {
            getLocation(locationId);

            List<ParkingFloor> floors = parkingFloorRepository.findFloorsByLocationId(locationId.toString());



            return floors.stream().map(this::toFloorResponseWithCounts).toList();

        } catch (EntityNotFoundException e) {
            log.error("Parking location {} not found: {}",locationId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error fetching floors for location: {}", locationId, e);
            throw e;
        }

    }


    @Override
    public Page<ParkingFloorResponse> getAllFloors(Pageable pageable)
    {
        log.info("Fetching all non-deleted parking floors");

        try
        {
            Page<ParkingFloor> floors = parkingFloorRepository.findAllFloors(pageable);

            Page<ParkingFloorResponse> response = floors.map(this::toFloorResponseWithCounts);

            log.info( "Successfully fetched parking floors. Total floors: {}, Current page: {}", response.getTotalElements(),response.getNumber());

            return response;
        }
        catch (Exception e)
        {
            log.error("Failed to fetch all parking floors", e);
            throw e;
        }
    }

    @Override
    public ParkingFloorResponse getFloorById(UUID id) {

        log.info("Fetching parking floor: {}", id);

        try {
            ParkingFloor floor = getFloor(id);

            return toFloorResponseWithCounts(floor);

        } catch (EntityNotFoundException e) {
            log.error("Parking floor not found: {}", e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error fetching parking floor: {}", id, e);
            throw e;
        }
    }


    @Override
    @Transactional
    public ParkingFloorResponse updateFloor(UUID id, ParkingFloorRequest request)
    {
        log.info("Updating parking floor: {}", id);

        try {
            ParkingFloor floor = getFloor(id);

            long floorExists = parkingFloorRepository.existsByLocationAndFloorNumberAndIdNot(floor.getLocation().getId().toString(),request.getFloorNumber(),id.toString());

            if(floorExists > 0)
            {
                log.warn("A floor with this number {} already exists in the location {} ", floor.getFloorNumber(), floor.getLocation().getLocationName());
                throw new IllegalArgumentException("A floor with this number already exists in the location");
            }

            floor.setFloorName(request.getFloorName());
            floor.setFloorNumber(request.getFloorNumber());

            ParkingFloor updatedFloor = parkingFloorRepository.save(floor);

            log.info("Parking floor updated successfully: {}", id);

            return parkingFloorMapper.toResponse(updatedFloor);


        } catch (EntityNotFoundException | IllegalArgumentException e) {
            log.error("Unable to update parking floor: {}", e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error updating parking floor: {}", id, e);
            throw e;
        }
    }


    @Override
    @Transactional
    public ParkingFloorResponse updateFloorStatus(UUID id, ParkingFloorStatusRequest request) {

        log.info("Updating status for parking floor: {}", id);

        try {
            ParkingFloor floor = getFloor(id);

//            if (request.getStatus() == null)
//            {
//                log.warn("Floor status is required to update the status {}",request.getStatus());
//                throw new IllegalArgumentException("Floor status is required");
//            }

            if (request.getStatus() == Status.ACTIVE) {

                // The location can remain INACTIVE during floor activation.
                getLocation(floor.getLocation().getId());

                boolean hasSlots = parkingSlotsRepository.existsByFloorId(floor.getId().toString());

                if (!hasSlots) {
                    throw new IllegalStateException("Cannot activate floor. Create at least one parking slot first.");
                }
            }

            floor.setStatus(request.getStatus());

            ParkingFloor updatedFloor = parkingFloorRepository.save(floor);

            log.info("Parking floor status updated successfully: {}", id);

            return parkingFloorMapper.toResponse(updatedFloor);

        } catch (EntityNotFoundException | IllegalArgumentException |
                 IllegalStateException e) {

            log.warn("Unable to update floor status {}: {}", id, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Error updating floor status: {}", id, e);
            throw e;
        }
    }


    @Override
    public List<ParkingFloorResponse> getActiveFloorsByLocation(UUID locationId)
    {
        log.info("Fetching active floors for location: {}", locationId);

        try {

            // Validate that the location exists and is active
            ParkingLocation location = getLocation(locationId);

            if (!location.getStatus().equals(Status.ACTIVE))
            {
                log.warn("Parking location {} is inactive", locationId);
                throw new IllegalArgumentException("Cannot fetch active floors because the parking location is inactive");
            }

            List<ParkingFloor> floors = parkingFloorRepository.findFloorsByLocationId(locationId.toString());

            List<ParkingFloorResponse> response = floors.stream().map(this::toFloorResponseWithCounts).toList();

            log.info("getting all active floors by location {} is fetched successfully", locationId);
            return response;

        }catch (EntityNotFoundException | IllegalArgumentException e)
        {
            log.error("Unable to fetch active floors for location {}: {}", locationId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error while fetching active floors for location {}",locationId,e);
            throw new RuntimeException("Unexpected error while fetching active floor for location",e);
        }


    }





    @Override
    public ParkingFloorResponse getActiveFloorById(UUID floorId) {

        log.info("Fetching active floor for customer: {}", floorId);

        try {

            ParkingFloor floor = getFloor(floorId);


            if (!Status.ACTIVE.equals(floor.getStatus())) {
                log.warn("Parking floor is inactive: {}", floorId);

                throw new IllegalArgumentException("This parking floor is currently inactive");
            }


            ParkingLocation location = getLocation(floor.getLocation().getId());

            if (!Status.ACTIVE.equals(location.getStatus()))
            {
                log.warn("Parking location is inactive: {}", location.getId());

                throw new IllegalArgumentException("This parking location is currently inactive");
            }

            log.info("Active floor fetched successfully: {}", floorId);

            return parkingFloorMapper.toResponse(floor);

        } catch (EntityNotFoundException | IllegalArgumentException e) {
            log.error("Unable to fetch active floor {}: {}", floorId, e.getMessage());
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error fetching active floor: {}", floorId, e);
            throw e;
        }
    }




    private ParkingFloorResponse toFloorResponseWithCounts(ParkingFloor floor) {
        ParkingFloorResponse response = parkingFloorMapper.toResponse(floor);

        String floorId = floor.getId().toString();

        response.setTotalSlots(parkingSlotsRepository.countTotalSlotsByFloorId(floorId));


        response.setAvailableSlots( parkingSlotsRepository.countAvailableSlotsByFloorId(floorId));


        return response;
    }



















    private ParkingLocation getLocation(UUID locationId) {

        return parkingLocationRepository.findLocationById(locationId.toString())
                .orElseThrow(() -> {
                    log.warn("Parking location not found for id {}",locationId);
                    return new EntityNotFoundException("Parking location not found");
                });
    }








    private ParkingFloor getFloor(UUID id)
    {
        return parkingFloorRepository.findFloorById(id.toString())
                .orElseThrow(() -> {
                    log.warn("parking floor not found for id {}",id);
                    return new EntityNotFoundException("Parking floor not found");
                });
    }


}
