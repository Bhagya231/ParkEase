package org.smart_parking.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingSessionEntryRequest;
import org.smart_parking.dto.response.AdminDashboardResponse;
import org.smart_parking.dto.response.ParkingSessionResponse;
import org.smart_parking.entity.ParkingPrice;
import org.smart_parking.entity.ParkingSession;
import org.smart_parking.entity.ParkingSlots;
import org.smart_parking.entity.Reservation;
import org.smart_parking.enums.*;
import org.smart_parking.mappers.ParkingSessionMapper;
import org.smart_parking.repositoty.*;
import org.smart_parking.service.api.ParkingSessionService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static java.time.Duration.between;

@Service
@RequiredArgsConstructor
public class ParkingSessionServiceImpl implements ParkingSessionService
{
    private static final Logger log = AppLogger.getLogger(ParkingSessionServiceImpl.class);

    private final ParkingSessionRepository parkingSessionRepository;
    private final ReservationRepository reservationRepository;
    private final ParkingSlotsRepository parkingSlotsRepository;
    private final ParkingSessionMapper parkingSessionMapper;
    private final ParkingLocationRepository parkingLocationRepository;
    private final ParkingPriceRepository parkingPriceRepository;




    @Transactional
    @Override
    public ParkingSessionResponse createEntry(ParkingSessionEntryRequest request)
    {

        log.info("Vehicle entry requested for reservation: {}", request.getReservationId());

        try {

            Reservation reservation = reservationRepository.findActiveReservationById(request.getReservationId().toString())
                    .orElseThrow(() -> {
                        log.warn("Reservation not found id {}",request.getReservationId());
                        return new EntityNotFoundException("Reservation not found");
                    });

            // Only the reservation owner can enter.
//            if (!reservation.getUser().getId().equals(userId))
//            {
//                log.warn("customer {} trying to make entry of other customer reservation {}", userId, request.getReservationId());
//                throw new IllegalArgumentException("You are not authorized to use this reservation");
//            }

            // checking the reservation is active or not
            if(reservation.getReservationStatus() != ReservationStatus.RESERVED)
            {
                log.error("reservation {} status {} only reserved status reservation can get the entry ",request.getReservationId(),reservation.getReservationStatus());
                throw new IllegalArgumentException("Reservation is not in RESERVED staus");
            }

            LocalDateTime entryTime = LocalDateTime.now();

            // Entry is allowed from startTime, but before endTime.
            if (entryTime.isBefore(reservation.getStartTime()))
            {
                log.warn("vehicle entry not allow before entry time {}", reservation.getStartTime());
                throw new IllegalStateException("Vehicle entry is not allowed before the reservation start time");
            }

            if (!entryTime.isBefore(reservation.getEndTime()))
            {
                log.warn("Reservation has expired. Late entry is not allowed after {} ",reservation.getEndTime());
                throw new IllegalStateException("Reservation has expired. Late entry is not allowed");
            }

            // Prevent another session for this reservation.
            if (parkingSessionRepository.findByReservationId(request.getReservationId().toString())
                    .isPresent()) {
                log.warn("session already exist for this reservation {}",request.getReservationId());
                throw new IllegalStateException("A session already exists for this reservation");
            }

            // checking the slot status
            ParkingSlots slot = reservation.getSlot();

            if (slot.getSlotStatus() != SlotStatus.AVAILABLE && slot.getSlotStatus() != SlotStatus.RESERVED)
            {
                log.warn("Slot {} is not available for entry. Status: {}", slot.getSlotNumber(), slot.getSlotStatus());

                throw new IllegalStateException("The parking slot is not available for entry");
            }

            if (parkingSessionRepository.findActiveSessionBySlotId(slot.getId().toString()).isPresent())
            {
                throw new IllegalStateException("Another vehicle is already occupying this slot");
            }


            String locationId = slot.getFloor().getLocation().getId().toString();
            String vehicleType = reservation.getVehicle().getVehicleType().name();

            ParkingPrice parkingPrice = parkingPriceRepository.findPriceByLocationAndVehicleType(locationId, vehicleType)
                    .orElseThrow(() -> {
                        log.warn("Perking price not configured for the location {} and vehicle type {}",locationId,vehicleType);
                        return new IllegalStateException("Parking price not configured for this location and vehicle type");
                    });


            long reservedMinutes = between(reservation.getStartTime(),reservation.getEndTime()).toMinutes();

            long reservedHours = (long) Math.ceil(reservedMinutes / 60.0);

            BigDecimal normalAmount = parkingPrice.getHourPrice().multiply(BigDecimal.valueOf(reservedHours));


            ParkingSession session = new ParkingSession();
            session.setReservation(reservation);
            session.setEntryTime(entryTime);
            session.setSessionStatus(SessionStatus.ACTIVE);
            session.setPaymentStatus(PaymentStatus.PENDING);
            session.setNormalAmount(normalAmount);
            session.setOverstayAmount(BigDecimal.ZERO);
            session.setParkingAmount(normalAmount);

            reservation.setParkingSession(session);
            reservation.setReservationStatus(ReservationStatus.IN_PROGRESS);

            ParkingSession savedSession = parkingSessionRepository.save(session);

            slot.setSlotStatus(SlotStatus.OCCUPIED);
            parkingSlotsRepository.save(slot);

            reservationRepository.save(reservation);

            log.info("Vehicle entry successful. Session ID: {}", savedSession.getId());

            return parkingSessionMapper.toResponse(savedSession);




        }catch (IllegalArgumentException | IllegalStateException | EntityNotFoundException e) {
            log.error("Error while making the vehicle entry: {}", e.getMessage());
            throw e;
        } catch (RuntimeException e) {
            log.error("Vehicle entry failed for reservation: {}", request.getReservationId(), e);
            throw e;
        }

    }



    @Transactional
    @Override
    public ParkingSessionResponse exitSession(UUID sessionId) {

        log.info("Vehicle exit requested for session: {}", sessionId);

        try {
            ParkingSession session = parkingSessionRepository.findById(sessionId)
                    .filter(parkingSession -> !parkingSession.getIsDeleted())
                    .orElseThrow(() -> {
                        log.error("parking session not found {}",sessionId);
                       return new IllegalArgumentException("Parking session not found");
                    });


            Reservation reservation = session.getReservation();

//            if (!reservation.getUser().getId().equals(userId))
//            {
//                log.warn("user {} don't have the access to exist this parking session {} ",userId,sessionId);
//                throw new IllegalArgumentException("You are not authorized to exit this parking session");
//            }

            if (session.getSessionStatus() != SessionStatus.ACTIVE || session.getExitTime() != null)
            {
                log.warn("parking session is not active and vehicle is already exited at {}",session.getExitTime());
                throw new IllegalStateException("Parking session is not active or vehicle has already exited");
            }

            LocalDateTime exitTime = LocalDateTime.now();

            LocalDateTime entryTime = session.getEntryTime();
            LocalDateTime reservedEndTime = reservation.getEndTime();

            long durationMinutes = between(entryTime, exitTime).toMinutes();

            if (durationMinutes < 0)
            {
                log.warn("exist time {} cannot be before entry time {}",exitTime,entryTime);
                throw new IllegalStateException("Exit time cannot be before entry time");
            }

            BigDecimal normalAmount = session.getNormalAmount();

            if (normalAmount == null)
            {
                log.warn("Normal parking amount is missing {}",normalAmount);
                throw new IllegalStateException("Normal parking amount is missing for this session");
            }

            BigDecimal overstayAmount = BigDecimal.ZERO;

            if (exitTime.isAfter(reservedEndTime))
            {

                long overstayMinutes = between(reservedEndTime, exitTime).toMinutes();

                long overstayHours = (long) Math.ceil(overstayMinutes / 60.0);

                ParkingSlots slot = reservation.getSlot();

                String locationId = slot.getFloor().getLocation().getId().toString();

                String vehicleType = reservation.getVehicle().getVehicleType().name();

                ParkingPrice parkingPrice = parkingPriceRepository.findPriceByLocationAndVehicleType(locationId, vehicleType)
                        .orElseThrow(() -> new IllegalStateException("Parking price not configured for overstay"));

                overstayAmount = parkingPrice.getOverstayPrice().multiply(BigDecimal.valueOf(overstayHours));
            }

            BigDecimal parkingAmount = normalAmount.add(overstayAmount);

            session.setExitTime(exitTime);
            session.setDurationMinutes(Math.toIntExact(durationMinutes));
            session.setNormalAmount(normalAmount);
            session.setOverstayAmount(overstayAmount);
            session.setParkingAmount(parkingAmount);
            session.setSessionStatus(SessionStatus.COMPLETED);

            // Payment is handled by a separate method.
            session.setPaymentStatus(PaymentStatus.PENDING);

            ParkingSlots slot = reservation.getSlot();

            if (exitTime.isBefore(reservedEndTime))
            {
                slot.setSlotStatus(SlotStatus.RESERVED);
            } else {
                slot.setSlotStatus(SlotStatus.AVAILABLE);
            }

            reservation.setReservationStatus(ReservationStatus.COMPLETED);

            ParkingSession savedSession = parkingSessionRepository.save(session);

            parkingSlotsRepository.save(slot);
            reservationRepository.save(reservation);



            log.info("Vehicle exit successful. Session ID: {}, Amount: {}", savedSession.getId(), savedSession.getParkingAmount());

            return parkingSessionMapper.toResponse(savedSession);

        } catch (RuntimeException exception) {
            log.error("Vehicle exit failed for session: {}", sessionId, exception);
            throw exception;
        }
    }


    @Override
    @Transactional(readOnly = true)
    public Page<ParkingSessionResponse> getSessions(UUID userId, Role role, SessionStatus status, Pageable pageable) {

        log.info("Fetching sessions for role: {}, user: {}, status: {}", role, userId, status);

        try {
            // checking the user role
            String userFilter;

            if (role == Role.ADMIN) {
                userFilter = null;
            } else if (role == Role.CUSTOMER) {
                userFilter = userId.toString();
            } else {
                throw new IllegalArgumentException("Unsupported user role");
            }

            String statusFilter = status == null ? null : status.name();



            return parkingSessionRepository.findSessions(userFilter, statusFilter, pageable).map(parkingSessionMapper::toResponse);

        }catch (IllegalArgumentException e)
        {
            log.error("error while fetching the sessions ");
            throw e;
        }
        catch (RuntimeException e) {
            log.error("Failed to fetch parking sessions", e);
            throw e;
        }
    }

//
//    @Override
//    @Transactional(readOnly = true)
//    public List<ParkingSessionResponse> getSessionsByUser(UUID userId) {
//
//        log.info("Fetching parking sessions for user: {}", userId);
//
//        try {
//            return parkingSessionRepository
//                    .findSessionsByUserId(userId.toString())
//                    .stream()
//                    .map(parkingSessionMapper::toResponse)
//                    .toList();
//
//        } catch (RuntimeException e) {
//            log.error("Failed to fetch sessions for user: {}", userId, e);
//            throw e;
//        }
//    }
//
//    @Transactional(readOnly = true)
//    @Override
//    public List<ParkingSessionResponse> getActiveSessions() {
//
//        log.info("Fetching active parking sessions");
//
//        try {
//            return parkingSessionRepository
//                    .findBySessionStatusAndIsDeletedFalse(SessionStatus.ACTIVE.name())
//                    .stream()
//                    .map(parkingSessionMapper::toResponse)
//                    .toList();
//
//        } catch (RuntimeException e) {
//            log.error("Failed to fetch active parking sessions", e);
//            throw e;
//        }
//    }
//
//
//    @Override
//    @Transactional(readOnly = true)
//    public ParkingSessionResponse getActiveSessionByUser(UUID userId) {
//
//        log.info("Fetching active parking session for user: {}", userId);
//
//        try {
//            ParkingSession session = parkingSessionRepository.findActiveSessionByUserId(userId.toString())
//                    .orElseThrow(() -> {
//                        log.warn("No active parking sessions found for this user {}",userId);
//                        return new EntityNotFoundException("No active parking session found for this user");
//                    });
//
//
//            return parkingSessionMapper.toResponse(session);
//
//        } catch (RuntimeException e) {
//            log.error("Failed to fetch active session for user: {}",userId,e);
//            throw e;
//        }
//    }



    @Override
    @Transactional(readOnly = true)
    public ParkingSessionResponse getSessionById(UUID sessionId, UUID userId) {

        log.info("Fetching parking session: {}", sessionId);

        try {
            ParkingSession session = parkingSessionRepository.findSessionByIdAndUserId(sessionId.toString(),userId.toString())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Parking session not found"));

            if (!session.getReservation().getUser().getId().equals(userId)) {
                throw new IllegalArgumentException(
                        "You are not authorized to view this parking session");
            }

            return parkingSessionMapper.toResponse(session);

        } catch (RuntimeException e) {
            log.error("Failed to fetch parking session: {}", sessionId, e);
            throw e;
        }
    }


    @Override
    @Transactional
    public ParkingSessionResponse payForSession(UUID sessionId, UUID userId) {

        log.info("Payment requested for session: {}", sessionId);

        try {
            ParkingSession session = parkingSessionRepository.findSessionByIdAndUserId(sessionId.toString(),userId.toString())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Parking session not found"));

            Reservation reservation = session.getReservation();

            if (!reservation.getUser().getId().equals(userId)) {
                throw new IllegalArgumentException("You are not authorized to pay for this session");
            }

            if (session.getSessionStatus() != SessionStatus.COMPLETED || session.getExitTime() == null) {
                throw new IllegalStateException("Payment is allowed only after the parking session is completed");
            }



            if (session.getParkingAmount() == null || session.getParkingAmount().compareTo(BigDecimal.ZERO) < 0)
            {
                throw new IllegalStateException("Invalid parking amount");
            }


            if (session.getPaymentStatus() == PaymentStatus.SUCCESSFUL) {
                throw new IllegalStateException("Payment has already been completed");
            }


                session.setPaymentStatus(PaymentStatus.SUCCESSFUL);
                log.info("Payment successful for session: {}", sessionId);


            ParkingSession savedSession = parkingSessionRepository.save(session);

            return parkingSessionMapper.toResponse(savedSession);

        } catch (RuntimeException e) {
            log.error("Payment processing failed for session: {}", sessionId, e);
            throw e;
        }
    }


    @Override
    public AdminDashboardResponse getAdminDashboardStats() {

        log.info("Fetching admin dashboard statistics");

        try {

            long totalLocations = parkingLocationRepository.countTotalLocations();

            long availableSlots = parkingSlotsRepository.countAvailableSlots();

            long occupiedSlots = parkingSlotsRepository.countOccupiedSlots();

            long activeSessions = parkingSessionRepository.countActiveSessions();

            BigDecimal totalRevenue = parkingSessionRepository.calculateTotalRevenue();

            AdminDashboardResponse res = new AdminDashboardResponse();

            res.setActiveSessions(activeSessions);
            res.setAvailableSlots(availableSlots);
            res.setOccupiedSlots(occupiedSlots);
            res.setTotalLocations(totalLocations);
            res.setTotalRevenue(totalRevenue == null ? BigDecimal.ZERO : totalRevenue);


            return  res;

        } catch (RuntimeException e) {
            log.error("Failed to fetch admin dashboard statistics", e);
            throw e;
        }
    }



}
