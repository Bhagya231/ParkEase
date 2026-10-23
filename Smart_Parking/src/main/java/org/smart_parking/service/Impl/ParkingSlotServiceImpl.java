package org.smart_parking.service.Impl;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;

import org.smart_parking.entity.ParkingLocation;
import org.smart_parking.enums.Status;
import org.smart_parking.repositoty.*;
import org.smart_parking.service.api.ParkingSlotService;
import org.smart_parking.service.api.ReservationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.smart_parking.dto.request.ParkingSlotCreateRequest;
import org.smart_parking.dto.request.ParkingSlotSearchRequest;
import org.smart_parking.dto.request.ParkingSlotStatusRequest;
import org.smart_parking.dto.request.ParkingSlotUpdateRequest;
import org.smart_parking.dto.response.ParkingSlotResponse;

import org.smart_parking.entity.ParkingFloor;
import org.smart_parking.entity.ParkingSlots;

import org.smart_parking.enums.SlotStatus;


import org.smart_parking.mappers.ParkingSlotMapper;
import org.smart_parking.util.AppLogger;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParkingSlotServiceImpl implements ParkingSlotService
{
    private static final Logger log = AppLogger.getLogger(ParkingSlotServiceImpl.class);

    private final ParkingSlotsRepository parkingSlotRepository;
    private final ParkingFloorRepository parkingFloorRepository;
    private final ParkingSlotMapper parkingSlotMapper;
   private final ReservationRepository reservationRepository;
   private final ParkingSessionRepository parkingSessionRepository;
    private final ParkingPriceRepository parkingPriceRepository;
    private final ReservationService reservationService;
    private final ParkingLocationRepository parkingLocationRepository;


    @Override
    @Transactional
    public List<ParkingSlotResponse> createSlots( UUID floorId,ParkingSlotCreateRequest request)
    {

        try {
            log.info("Creating parking slots for floor ID: {}", floorId);

            ParkingFloor floor = parkingFloorRepository.findFloorById(floorId.toString())
                    .orElseThrow(() ->
                    {
                        log.warn("parking floor {} is not found ", floorId);
                        return new EntityNotFoundException("Parking floor not found");
                    });



            List<ParkingSlots> slots = new ArrayList<>();

            for (int i = 0; i < request.getSlotCount(); i++)
            {
                int number = request.getStartingNumber() + i;

                String slotNumber = request.getSectionName().trim() + "-" + String.format("%02d", number);




                if ((parkingSlotRepository.existsByFloorAndSlotNumber(floorId.toString(), slotNumber)) > 0)
                {
                    log.warn("Slot number {} already exists on this floor",slotNumber);
                    throw new IllegalArgumentException("Slot number already exists on this floor: " + slotNumber);


                }

                ParkingSlots slot = new ParkingSlots();

                slot.setFloor(floor);
                slot.setSectionName(request.getSectionName().trim());
                slot.setSlotNumber(slotNumber);
                slot.setVehicleType(request.getVehicleType());
                slot.setSlotType(request.getSlotType());

                // Slots remain unavailable until setup is completed.
                slot.setSlotStatus(SlotStatus.AVAILABLE);



                slots.add(slot);
            }

            List<ParkingSlots> savedSlots = parkingSlotRepository.saveAll(slots);

            floor.setStatus(Status.ACTIVE);
            parkingFloorRepository.save(floor);

            ParkingLocation location = floor.getLocation();

            location.setStatus(Status.ACTIVE);

            parkingLocationRepository.save(location);



            log.info("Successfully created {} slots for floor ID: {}",savedSlots.size(), floorId);


            return savedSlots.stream().map(parkingSlotMapper::toResponse).toList();

        }catch (EntityNotFoundException | IllegalStateException | IllegalArgumentException e)
        {
            log.warn(e.getMessage());
            throw e;

        } catch (RuntimeException e) {
            log.error("Failed to create parking slots for floor ID: {}", floorId, e);
            throw e;
        }
    }


    @Override
    @Transactional(readOnly = true)
    public List<ParkingSlotResponse> getSlotsByFloor(UUID floorId,ParkingSlotSearchRequest request)
    {

        try {

            reservationService.expireReservationsInternal(LocalDateTime.now());

            log.info("Fetching parking slots for floor ID: {}", floorId);

            parkingFloorRepository.findFloorById(floorId.toString())
                    .orElseThrow(() ->
                    {
                        log.warn("Parking floor not found for id : {}", floorId);
                        return new IllegalArgumentException("Parking floor not found");
                    });


            List<ParkingSlots> slots;

            if (request == null) {
                slots = parkingSlotRepository.findSlotsByFloor(floorId.toString());
            } else {
                slots = parkingSlotRepository.searchSlotsByFloor(floorId.toString(),request.getSectionName(),
                        request.getVehicleType() == null
                                ? null : request.getVehicleType().name(),
                        request.getSlotType() == null
                                ? null : request.getSlotType().name(),
                        request.getSlotStatus() == null
                                ? null : request.getSlotStatus().name()
                );
            }

            return slots.stream().map(parkingSlotMapper::toResponse).toList();

        } catch (RuntimeException e) {
            log.error("Failed to fetch slots for floor ID: {}", floorId, e);
            throw e;
        }
    }




    @Override
    @Transactional(readOnly = true)
    public ParkingSlotResponse getSlotById(UUID slotId)
    {

        try {
            log.info("Fetching parking slot ID: {}", slotId);

            ParkingSlots slot = parkingSlotRepository.findActiveSlotById(slotId.toString())
                    .orElseThrow(() ->
                    {
                        log.warn("Parking slot not found for id {}", slotId);
                        return new EntityNotFoundException("Parking slot not found");
                    });


            return parkingSlotMapper.toResponse(slot);

        }catch (EntityNotFoundException e)
        {
            log.warn( " error in get slot by id {} has error {}",slotId,e.getMessage());
            throw e;

        } catch (RuntimeException e) {
            log.error("Failed to fetch parking slot ID: {}", slotId, e);
            throw e;
        }
    }




    @Override
    @Transactional
    public ParkingSlotResponse updateSlot(UUID slotId,ParkingSlotUpdateRequest request)
    {

        try {
            log.info("Updating parking slot ID: {}", slotId);

            ParkingSlots slot = parkingSlotRepository.findActiveSlotById(slotId.toString())
                    .orElseThrow(() ->
                    {
                        log.warn("Parking Slot not found with id {}",slotId);
                        return new EntityNotFoundException("Parking slot not found");
                    });

            String sectionName = request.getSectionName().trim();
            String slotNumber = request.getSlotNumber().trim();

            long exists = parkingSlotRepository.existsByFloorAndSlotNumberAndIdNot(slot.getFloor().getId().toString(),
                    slotNumber, slotId.toString());

            if (exists > 0)
            {
                log.warn("Slot number already exists on this floor " + request.getSlotNumber());
                throw new IllegalArgumentException("Slot number already exists on this floor: " + request.getSlotNumber());
            }

            slot.setSectionName(sectionName);
            slot.setSlotNumber(slotNumber);
            slot.setVehicleType(request.getVehicleType());
            slot.setSlotType(request.getSlotType());

            ParkingSlots updatedSlot = parkingSlotRepository.save(slot);

            log.info("Successfully updated parking slot ID: {}", slotId);

            return parkingSlotMapper.toResponse(updatedSlot);

        }catch (EntityNotFoundException | IllegalArgumentException e)
        {
            log.warn("error while updating the slot id {}",slotId);
            throw e;

        } catch (RuntimeException e) {
            log.error("Failed to update parking slot ID: {}", slotId, e);
            throw e;
        }
    }


    @Override
    @Transactional
    public ParkingSlotResponse updateSlotStatus(UUID slotId, ParkingSlotStatusRequest request)
    {

        log.info("Updating status for parking slot ID: {}", slotId);

        try {
            //  Find the non-deleted parking slot.
            ParkingSlots slot = parkingSlotRepository.findActiveSlotById(slotId.toString())
                    .orElseThrow(() -> new EntityNotFoundException("Parking slot not found"));

            //  Validate the request.
            if (request == null || request.getSlotStatus() == null) {
                throw new IllegalArgumentException("Slot status is required");
            }

            SlotStatus requestedStatus = request.getSlotStatus();
            SlotStatus currentStatus = slot.getSlotStatus();

            //  Admin can only manage availability.
            if (requestedStatus != SlotStatus.AVAILABLE && requestedStatus != SlotStatus.UNAVAILABLE) {
                throw new IllegalArgumentException("Admin can only set a slot to AVAILABLE or UNAVAILABLE");
            }

            //  No work is required if the status is already the same.
            if (currentStatus == requestedStatus)
            {
                log.info("Slot {} already has status {}", slotId, requestedStatus);
                return parkingSlotMapper.toResponse(slot);
            }

            //  Do not override reservation or session states.
            if (currentStatus == SlotStatus.RESERVED || currentStatus == SlotStatus.OCCUPIED)
            {
                throw new IllegalStateException("Cannot change availability while the slot is reserved or occupied");
            }

            //  Check active reservations and sessions before changing availability.
            boolean hasActiveReservation = reservationRepository.existsActiveReservationBySlotId(slotId.toString());

            boolean hasActiveSession = parkingSessionRepository.existsActiveSessionBySlotId(slotId.toString());

            if (hasActiveReservation || hasActiveSession)
            {
                throw new IllegalStateException("Cannot change slot availability while an active reservation " + "or parking session exists");
            }

            //  Active pricing is required before making the slot available.
            if (requestedStatus == SlotStatus.AVAILABLE) {

                UUID locationId = slot.getFloor().getLocation().getId();

                long priceExists = parkingPriceRepository.existsActivePriceForVehicleType(locationId.toString(), slot.getVehicleType().name());

                if (priceExists == 0)
                {
                    throw new IllegalStateException("Cannot make slot available. Configure active pricing for vehicle type: " + slot.getVehicleType());
                }
            }

            //  Update and save the slot status.
            slot.setSlotStatus(requestedStatus);

            ParkingSlots updatedSlot = parkingSlotRepository.save(slot);

            log.info("Slot {} status changed from {} to {}", slotId, currentStatus, requestedStatus);

            return parkingSlotMapper.toResponse(updatedSlot);

        } catch (EntityNotFoundException | IllegalArgumentException | IllegalStateException e) {

            log.warn("Unable to update slot status {}: {}", slotId, e.getMessage());
            throw e;

        } catch (RuntimeException e) {
            log.error("Failed to update status for slot ID: {}", slotId, e);
            throw e;
        }
    }






    @Override
    @Transactional(readOnly = true)
    public List<ParkingSlotResponse> getCustomerSlotsByLocationAndFloor(UUID locationId, UUID floorId, ParkingSlotSearchRequest request)
    {

        try {
            log.info("Fetching customer slots for location ID: {} and floor ID: {}", locationId, floorId);



            if (request == null || request.getStartTime() == null  || request.getEndTime() == null)
            {

                log.warn("Booking start time  and end time  are not provided {}",request);
                throw new IllegalArgumentException( "Booking start time and end time are required");

            }

            LocalDateTime startTime = request.getStartTime();
            LocalDateTime endTime = request.getEndTime();

            if (!startTime.isAfter(LocalDateTime.now()))
            {
                log.warn("booking start time {} must e in future ",startTime);
                throw new IllegalArgumentException( "Booking start time must be in the future");

            }

            if (!endTime.isAfter(startTime))
            {
                log.warn("booking end time {} must be after start time {} ",endTime,startTime);
                throw new IllegalArgumentException("Booking end time must be after start time");

            }

            // fetch slots using the customer's search filters.
            List<ParkingSlots> slots = parkingSlotRepository.findCustomerSlotsByLocationAndFloor( locationId.toString(),
                            floorId.toString(),
                            request.getVehicleType() == null ? null : request.getVehicleType().name(),
                            request.getSlotType() == null ? null : request.getSlotType().name(),
                            request.getSectionName() == null || request.getSectionName().isBlank() ? null : request.getSectionName().trim());

            List<ParkingSlotResponse> responses = new ArrayList<>();

            for (ParkingSlots slot : slots) {

                SlotStatus effectiveStatus;

                // Unavailable slots must never be offered for booking.
                if (slot.getSlotStatus() == SlotStatus.UNAVAILABLE)
                {
                    effectiveStatus = SlotStatus.UNAVAILABLE;
                } else {
                    long overlappingBookings = reservationRepository.countOverlappingReservations(slot.getId().toString(), startTime, endTime);

                    if (overlappingBookings > 0)
                    {
                        effectiveStatus = slot.getSlotStatus() == SlotStatus.OCCUPIED ? SlotStatus.OCCUPIED : SlotStatus.RESERVED;
                    } else {
                        // The slot is free for this requested time range.
                        effectiveStatus = SlotStatus.AVAILABLE;
                    }
                }

                ParkingSlotResponse response = parkingSlotMapper.toResponse(slot);

                // Change the response only, not the database entity.
                response.setSlotStatus(effectiveStatus);

                // Apply status filtering AFTER calculating time-based status.
                if (request.getSlotStatus() == null || request.getSlotStatus() == effectiveStatus)
                {
                    responses.add(response);
                }
            }

            log.info("Found {} matching slots for location ID: {} and floor ID: {}",responses.size(), locationId, floorId);


            return responses;

        } catch (EntityNotFoundException | IllegalArgumentException e)
        {
            log.warn("Unable to fetch customer slots: {}", e.getMessage());
            throw e;
        } catch (RuntimeException e)
        {
            log.error("Failed to fetch customer slots for location ID: {} and floor ID: {}",locationId, floorId, e);


            throw e;
        }
    }


}
