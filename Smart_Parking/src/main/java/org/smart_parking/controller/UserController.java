package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingLocationSearchRequest;

import org.smart_parking.dto.request.ParkingSlotSearchRequest;
import org.smart_parking.dto.request.ReservationRequest;
import org.smart_parking.dto.response.*;

import org.smart_parking.enums.Role;
import org.smart_parking.enums.SessionStatus;
import org.smart_parking.facade.api.*;
import org.smart_parking.security.CustomUserDetails;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController
{

    private static final Logger log = AppLogger.getLogger(UserController.class);

    private final ParkingLocationFacade parkingLocationFacade;
    private final ParkingFloorFacade parkingFloorFacade;
    private final ParkingSlotFacade parkingSlotFacade;
    private final ParkingPriceFacade parkingPriceFacade;
    private final ReservationFacade reservationFacade;
    private final ParkingSessionFacade parkingSessionFacade;



    @GetMapping("/locations")
    public ResponseEntity<Page<ParkingLocationResponse>> getActiveLocations(@Valid @ModelAttribute ParkingLocationSearchRequest request, Pageable pageable) {

        log.info("Customer request received to fetch active parking locations");

        try {
            // Customers can only view active, non-deleted locations.
            request.setFilter("ACTIVE");

            Page<ParkingLocationResponse> response = parkingLocationFacade.getAllLocations(request,pageable );

            log.info("Fetching active parking locations completed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to fetch active parking locations", e);
            throw e;
        }
    }


    @GetMapping("/{locationId}")
    public ResponseEntity<ParkingLocationResponse> getLocationById(@PathVariable UUID locationId)
    {

        log.info("Customer requesting location details: {}", locationId);

        try {
            ParkingLocationResponse response = parkingLocationFacade.getActiveLocationById(locationId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to fetch customer location: {}", locationId, e);
            throw e;
        }
    }







    // Get active floors for an active parking location
    @GetMapping("/locations/{locationId}/floors")
    public ResponseEntity<List<ParkingFloorResponse>> getActiveFloorsByLocation(@PathVariable UUID locationId) {

        log.info("Customer request to fetch active floors for location: {}", locationId);

        try {
            List<ParkingFloorResponse> response = parkingFloorFacade.getActiveFloorsByLocation(locationId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to fetch active floors for location: {}", locationId, e);
            throw e;
        }
    }

    // Get details of an active floor under an active location
    @GetMapping("/floors/{floorId}")
    public ResponseEntity<ParkingFloorResponse> getActiveFloorById(@PathVariable UUID floorId) {

        log.info("Customer request to fetch active floor: {}", floorId);

        try {
            ParkingFloorResponse response = parkingFloorFacade.getActiveFloorById(floorId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to fetch active floor: {}", floorId, e);
            throw e;
        }
    }



    // Get available slots for a location and floor
    @GetMapping("/{locationId}/floors/{floorId}/slots")
    public ResponseEntity<List<ParkingSlotResponse>> getAvailableSlots(@PathVariable UUID locationId, @PathVariable UUID floorId,
            @Valid @ModelAttribute ParkingSlotSearchRequest request)
    {

        try {
            log.info("Request received to get available parking slots");

            List<ParkingSlotResponse> slots = parkingSlotFacade.getCustomerSlotsByLocationAndFloor(locationId, floorId, request);

            return ResponseEntity.ok(slots);

        } catch (RuntimeException e) {
            log.error("Failed to retrieve available parking slots", e);
            throw e;
        }
    }


    @GetMapping("/locations/{locationId}/pricing")
    public ResponseEntity<Page<ParkingPriceResponse>> getPricesByLocation(@PathVariable UUID locationId, Pageable pageable) {

        log.info(" User fetching prices for location: {}",locationId);

        Page<ParkingPriceResponse> response = parkingPriceFacade.getPriceByLocation(locationId, pageable);

        return ResponseEntity.ok(response);


    }


    @PostMapping("/reservation")
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request)
    {
        log.info("Request received to create reservation");

        ReservationResponse response = reservationFacade.createReservation(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping("/reservation")
    public ResponseEntity<Page<ReservationResponse>> getMyReservations( Pageable pageable)
    {
        log.info("request received to get the reservations for user ");

        Page<ReservationResponse> responses = reservationFacade.getReservationsByUser(pageable);

        return ResponseEntity.ok(responses);

    }


    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable UUID reservationId)
    {
        log.info("request reached endpoint for getReservation by id {}", reservationId);

        ReservationResponse response = reservationFacade.getReservationById(reservationId);

        return ResponseEntity.ok(response);

    }


    @PatchMapping("/{reservationId}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(@PathVariable UUID reservationId)
    {
        log.info("request reached endpoint for cancel request for reservation {}",reservationId);

        ReservationResponse response = reservationFacade.cancelReservation(reservationId);

        return ResponseEntity.ok(response);

    }




    // Pay for a completed parking session
    @PostMapping("/sessions/{sessionId}/payment")
    public ResponseEntity<ParkingSessionResponse> payForParkingSession(@PathVariable UUID sessionId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        log.info("Customer request to pay for parking session: {}", sessionId);

        try {
            ParkingSessionResponse response = parkingSessionFacade.payForSession(sessionId, userDetails.getUserId());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Failed to process parking session payment: {}", sessionId, e);
            throw e;
        }
    }


    // Get the logged-in customer's sessions, optionally filtered by status
    @GetMapping("/sessions")
    public ResponseEntity<Page<ParkingSessionResponse>> getMyParkingSessions(@RequestParam(required = false) SessionStatus status,
            @AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {

        log.info("Customer request to fetch parking sessions with status: {}", status);

        try {
            Page<ParkingSessionResponse> responses = parkingSessionFacade.getSessions(userDetails.getUserId(), Role.CUSTOMER, status, pageable);

            return ResponseEntity.ok(responses);

        } catch (RuntimeException e) {
            log.error("Failed to fetch customer parking sessions", e);
            throw e;
        }
    }

    // Get one parking session by ID
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<ParkingSessionResponse> getMyParkingSessionById(@PathVariable UUID sessionId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        log.info("Customer request to fetch parking session: {}", sessionId);

        try {
            ParkingSessionResponse response = parkingSessionFacade.getSessionById(sessionId, userDetails.getUserId());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Failed to fetch parking session: {}", sessionId, e);
            throw e;
        }
    }








}
