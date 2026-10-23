package org.smart_parking.service.Impl;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ReservationRequest;
import org.smart_parking.dto.response.ReservationResponse;
import org.smart_parking.entity.*;
import org.smart_parking.enums.ReservationStatus;
import org.smart_parking.enums.SessionStatus;
import org.smart_parking.enums.SlotStatus;
import org.smart_parking.enums.Status;
import org.smart_parking.exception.InvalidCredentialsException;
import org.smart_parking.mappers.ReservationMapper;
import org.smart_parking.repositoty.*;
import org.smart_parking.security.CustomUserDetails;
import org.smart_parking.service.api.ReservationService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService
{

    private static final Logger log = AppLogger.getLogger(ReservationServiceImpl.class);


    private final ReservationRepository reservationRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSlotsRepository parkingSlotsRepository;
    private final ParkingPriceRepository parkingPriceRepository;
    private final ReservationMapper reservationMapper;
    private final ParkingSessionRepository parkingSessionRepository;



    @Override
    @Transactional
    public ReservationResponse createReservation(UUID userId, ReservationRequest request)
    {


        try {

            log.info("Creating reservation for user ID: {}", userId);


            LocalDateTime now = LocalDateTime.now();

            //  Validate reservation time.
            if (request.getStartTime().isBefore(now)) {
                log.warn("Reservation start time {} cannot be in the past", request.getStartTime());
                throw new IllegalArgumentException("Reservation start time cannot be in the past");

            }

            if (!request.getEndTime().isAfter(request.getStartTime())) {
                log.warn("End time {} must be after start time {}", request.getEndTime(), request.getStartTime());
                throw new IllegalArgumentException("End time must be after start time");

            }

            // Verify that the vehicle belongs to the logged-in user.
            Vehicle vehicle = vehicleRepository.findVehicleByIdAndUserId(request.getVehicleId().toString(), userId.toString())
                    .orElseThrow(() ->
                    {
                        log.warn("Vehicle not found for this user {}",userId);
                        return new EntityNotFoundException("Vehicle not found for this user");
                    });

            //  Find the selected slot.
            ParkingSlots slot = parkingSlotsRepository.findActiveSlotById(request.getSlotId().toString())
                    .orElseThrow(() ->
                    {
                        log.warn("Parking Slot is not found with slotId {}",request.getSlotId());
                        return new EntityNotFoundException("Parking slot not found");


                    });

            if (slot.getSlotStatus() != SlotStatus.AVAILABLE)
            {
                throw new IllegalStateException("Parking slot is not available for reservation");
            }


            //  Validate vehicle type  with the slot.
            if (slot.getVehicleType() != vehicle.getVehicleType())
            {
                log.warn("Selected slot {} is not suitable for this vehicle {}",slot.getSlotNumber(),vehicle.getVehicleType());
                throw new IllegalArgumentException("Selected slot is not suitable for this vehicle");
            }

            ParkingFloor floor = slot.getFloor();
            ParkingLocation location = floor.getLocation();

            if (floor.getStatus() != Status.ACTIVE) {
                log.warn("parking floor {} is inactive ",floor.getFloorName());
                throw new IllegalArgumentException("Parking floor is inactive");
            }

            if (location.getStatus() != Status.ACTIVE)
            {
                log.warn("parking location {} is inactive ", location.getLocationName());
                throw new IllegalArgumentException( "Parking location is inactive");

            }

            //  Expire overdue reservations before checking overlap.
            expireReservationsInternal(now);

            //  Check overlapping reservations for the selected slot.
            long overlappingReservations = reservationRepository.countOverlappingReservations(slot.getId().toString(),
                            request.getStartTime(),
                            request.getEndTime());

            if (overlappingReservations > 0)
            {
                log.warn("Parking slot {} is already reserved for the selected time ", slot.getSlotNumber());
                throw new IllegalArgumentException("Parking slot is already reserved for the selected time");
            }

            //  Verify pricing exists for this location and vehicle type.
            parkingPriceRepository.findPriceByLocationAndVehicleType(location.getId().toString(), vehicle.getVehicleType().name())
                    .orElseThrow(() ->
                    {
                        log.warn("pricing is not configured for this vehicle type {}",vehicle.getVehicleType().name());
                        return new EntityNotFoundException("Pricing is not configured for this vehicle type");

                    });

            //  Create the reservation.
            Reservation reservation = new Reservation();

            reservation.setUser(vehicle.getUser());
            reservation.setVehicle(vehicle);
            reservation.setSlot(slot);
            reservation.setStartTime(request.getStartTime());
            reservation.setEndTime(request.getEndTime());
            reservation.setReservationStatus(ReservationStatus.RESERVED);

            reservation.setReservationNumber("SP-" + (int) (Math.random() * 900000 + 100000));

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("Reservation created successfully. Reservation ID: {}", savedReservation.getId());


            return reservationMapper.toResponse(savedReservation);


        } catch (EntityNotFoundException e) {
            log.warn("Reservation creation rejected for user {}: {}",userId,e.getMessage());

            throw e;

        } catch (RuntimeException e) {
            log.error("Error creating reservation for user ID: {}",userId,e);

            throw e;

        } catch (Exception e) {
            log.error("Unexpected error creating reservation for user ID: {}",userId, e);

            throw new RuntimeException("Failed to create reservation", e);

        }


    }


    @Override
    @Transactional
    public void expireReservationsInternal(LocalDateTime currentTime) {
        try {
            log.info("Starting reservation expiration at {}", currentTime);

            List<Reservation> reservationsToExpire = reservationRepository.findReservationsToExpire(currentTime);

            for (Reservation reservation : reservationsToExpire)
            {
                ParkingSlots slot = reservation.getSlot();

                // Do not expire a reservation if its vehicle is still parked.
                boolean hasActiveSession = parkingSessionRepository.findActiveSessionBySlotId(slot.getId().toString()).isPresent();

                if (hasActiveSession) {
                    log.info("Reservation {} is not expired because slot {} has an active session", reservation.getId(), slot.getSlotNumber());
                    continue;
                }

                // Expire the unused reservation.
                reservation.setReservationStatus(ReservationStatus.EXPIRED);
                reservationRepository.save(reservation);

                log.info("Reservation {} expired successfully", reservation.getId());


                // Check for other valid reservations overlapping the current
                // time through the expired reservation's end time.
                long overlappingReservations = reservationRepository.countOverlappingReservations(slot.getId().toString(),
                                currentTime,
                                reservation.getEndTime().plusNanos(1));

                // Release the slot only when no overlapping reservation
                // and no active session requires it.

                if ( overlappingReservations == 0 && slot.getSlotStatus() == SlotStatus.RESERVED)
                {
                    slot.setSlotStatus(SlotStatus.AVAILABLE);
                    parkingSlotsRepository.save(slot);

                    log.info("Slot {} is now available", slot.getSlotNumber());
                } else {
                    log.info("Slot {} remains unavailable because another reservation or session requires it", slot.getSlotNumber());
                }
            }

            log.info("Reservation expiration completed. Total expired: {}", reservationsToExpire.size());

        } catch (Exception e) {
            log.error("Unexpected error while expiring reservations", e);
            throw new RuntimeException("Failed to expire reservations", e);
        }
    }



    @Override
    public Page<ReservationResponse> getReservationsByUser(UUID userId, Pageable pageable)
    {

        try {

            log.info("Fetching reservations for user ID: {}", userId);



            Page<Reservation> reservations = reservationRepository.findReservationsByUserId(userId.toString(), pageable);





            Page<ReservationResponse> responses = reservations.map(reservationMapper::toResponse);




            log.info("Found {} reservations on page {} for user Id {}",responses.getNumberOfElements(),responses.getNumber(),userId);

            return responses;

        }catch (Exception e)
        {
            log.error("Failed to fetch reservations for user ID: {} got error {}",userId,e.getMessage());
            throw new RuntimeException("Failed to fetch the user reservations ", e);
        }


    }


    @Override
    public ReservationResponse getReservationById(UUID id)
    {

        try {
            log.info("Fetching reservation with id {}",id);

            expireReservationsInternal(LocalDateTime.now());

            Reservation reservation = reservationRepository.findActiveReservationById(id.toString())
                    .orElseThrow(() -> {
                        log.warn("Reservation not found with ID: {}",id);
                        return new EntityNotFoundException("Reservation not found");
                    });

            ReservationResponse response = reservationMapper.toResponse(reservation);

            log.info("Reservation fetched successfully. ID: {}",id);

            return response;

        }catch (EntityNotFoundException e)
        {
            log.error("error while fetching the reservation by id {}",id);
            throw e;
        }catch(Exception e)
        {
            log.error("Unable to fetch the reservation by id {}", id);
            throw new RuntimeException("unexpected error while fetching the reservations ", e);
        }

    }


    @Override
    public ReservationResponse cancelReservation(UUID userId,UUID reservationId)
    {


        try {
            log.info("Cancelling reservation {} for user {}",reservationId,userId);

            Reservation reservation = reservationRepository.findActiveReservationById(reservationId.toString())
                    .orElseThrow(() -> {
                        log.warn("reservation is not found with reservation id {}",reservationId);
                        throw new EntityNotFoundException("reservation is not found ");
                    });

            // Verify reservation of user .
            if (!reservation.getUser().getId().equals(userId))
            {
                log.warn("User {} attempted to cancel another user's reservation {}",userId,reservationId );
                throw new InvalidCredentialsException("You are not allowed to cancel this reservation");
            }


            // Only RESERVED reservations can be canceled.
            if (reservation.getReservationStatus() != ReservationStatus.RESERVED)
            {
                log.warn("reservation {} cannot be cancelled because its status {} ", reservationId,reservation.getReservationStatus() );
                throw new IllegalArgumentException( "Only reserved bookings can be cancelled");
            }

            // Do not cancel if a parking session has already started.
            ParkingSession session = reservation.getParkingSession();

            if (session != null && session.getSessionStatus() == SessionStatus.ACTIVE && session.getExitTime() == null)
            {
                log.warn("Reservation {} has a parking session and cannot be cancelled", reservationId);
                throw new IllegalArgumentException("Reservation cannot be cancelled after vehicle entry");
            }

            //update reservation status.

            reservation.setReservationStatus(ReservationStatus.CANCELLED);
            Reservation cancelledReservation = reservationRepository.save(reservation);

            log.info("Reservation {} cancelled successfully ",reservationId);

            return  reservationMapper.toResponse(cancelledReservation);


        }catch (EntityNotFoundException e)
        {
            log.error("error while canceling the reservation {}",reservationId);
            throw e;
        } catch (Exception e) {
            log.error("unexpected error while canceling reservation {}",reservationId);
            throw new RuntimeException("Unexpected error while canceling reservation ",e);
        }
    }


    @Override
    public Page<ReservationResponse> getAllReservations(ReservationStatus status, UUID locationId, Pageable pageable)
    {
        try {

            expireReservationsInternal(LocalDateTime.now());

            log.info("Fetching all reservations. Status: {}, Location id: {}, page: {},size {}",status,locationId,pageable.getPageNumber(),pageable.getPageSize());


            Page<Reservation> reservations = reservationRepository.findAllReservationsWithFilters(status == null ?  null : status.name(), locationId == null ? null : locationId.toString(), pageable);

            Page<ReservationResponse> responses = reservations.map(reservationMapper::toResponse);

            log.info("fetched {}  reservations on page {}. Total matching reservations: {}",responses.getNumberOfElements(),
                    responses.getNumber(), responses.getTotalElements());

            return responses;
        }catch (Exception e)
        {
            log.error("error while fetching the all reservation ");
            throw  new RuntimeException("error while fetching all reservation ",e);
        }
    }











}
