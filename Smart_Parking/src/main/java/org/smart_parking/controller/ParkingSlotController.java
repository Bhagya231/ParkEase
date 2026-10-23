package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingSlotCreateRequest;
import org.smart_parking.dto.request.ParkingSlotSearchRequest;
import org.smart_parking.dto.request.ParkingSlotStatusRequest;
import org.smart_parking.dto.request.ParkingSlotUpdateRequest;
import org.smart_parking.dto.response.ParkingSlotResponse;
import org.smart_parking.dto.response.ReservationResponse;
import org.smart_parking.enums.ReservationStatus;
import org.smart_parking.facade.api.ParkingSlotFacade;
import org.smart_parking.facade.api.ReservationFacade;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class ParkingSlotController
{
    private static final Logger log = AppLogger.getLogger(ParkingSlotController.class);

    private final ParkingSlotFacade parkingSlotFacade;
    private final ReservationFacade reservationFacade;

    @PostMapping("/floors/{floorId}/slots")
    public ResponseEntity<List<ParkingSlotResponse>> createSlots(@PathVariable UUID floorId, @Valid @RequestBody ParkingSlotCreateRequest request)
    {


            log.info("Admin request to create slots for floor: {}", floorId);

            List<ParkingSlotResponse> response = parkingSlotFacade.createSlots(floorId, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);


    }



    @GetMapping("/floors/{floorId}/slots")
    public ResponseEntity<List<ParkingSlotResponse>> getSlotsByFloor(@PathVariable UUID floorId, @ModelAttribute ParkingSlotSearchRequest request) {


            log.info("Admin request to fetch slots for floor: {}", floorId);

            List<ParkingSlotResponse> res = parkingSlotFacade.getSlotsByFloor(floorId, request);

            log.info("fetching slots for floor is completed successfully ");

            return ResponseEntity.ok(res);

    }




    @GetMapping("/slots/{slotId}")
    public ResponseEntity<ParkingSlotResponse> getSlotById(@PathVariable UUID slotId)
    {

            log.info("Admin request to fetch slot: {}", slotId);

            return ResponseEntity.ok(parkingSlotFacade.getSlotById(slotId));


    }


    @PutMapping("/slots/{slotId}")
    public ResponseEntity<ParkingSlotResponse> updateSlot(@PathVariable UUID slotId, @Valid @RequestBody ParkingSlotUpdateRequest request)
    {

            log.info("Admin request to update slot: {}", slotId);

            ParkingSlotResponse res = parkingSlotFacade.updateSlot(slotId, request);

            return ResponseEntity.ok(res);


    }


    @PatchMapping("/slots/{slotId}/status")
    public ResponseEntity<ParkingSlotResponse> updateSlotStatus(@PathVariable UUID slotId, @Valid @RequestBody ParkingSlotStatusRequest request)
    {
            log.info("Admin request to update slot status: {}", slotId);

            ParkingSlotResponse res = parkingSlotFacade.updateSlotStatus(slotId, request);

            return ResponseEntity.ok(res);


    }


    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable UUID reservationId)
    {
        log.info("end point reached for the get reservation by id {}",reservationId);
        ReservationResponse res = reservationFacade.getReservationById(reservationId);

        return ResponseEntity.ok(res);

    }

    // Admin: Get all reservations with optional filters
    @GetMapping("/allreservations")
    public ResponseEntity<Page<ReservationResponse>> getAllReservations(
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) UUID locationId, Pageable pageable)
    {
        log.info("fetching all reservation reached end point ");
        Page<ReservationResponse> responses = reservationFacade.getAllReservations(status, locationId, pageable);

        return ResponseEntity.ok(responses);

    }




    }
