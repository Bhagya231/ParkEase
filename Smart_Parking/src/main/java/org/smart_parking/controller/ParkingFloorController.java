package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingFloorRequest;
import org.smart_parking.dto.request.ParkingFloorStatusRequest;
import org.smart_parking.dto.response.ParkingFloorResponse;
import org.smart_parking.facade.api.ParkingFloorFacade;
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
public class ParkingFloorController
{
    private static final Logger log = AppLogger.getLogger(ParkingFloorController.class);

    private final ParkingFloorFacade parkingFloorFacade;

    // Create a floor under a parking location
    @PostMapping("/{locationId}/floors")
    public ResponseEntity<ParkingFloorResponse> createFloor(@PathVariable UUID locationId, @Valid @RequestBody ParkingFloorRequest request)
    {
        log.info("Admin request to create floor for location: {}", locationId);

        try {
            ParkingFloorResponse response = parkingFloorFacade.createFloor(locationId, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Failed to create floor for location: {}", locationId, e);
            throw e;
        }

    }

    // Get all non-deleted floors for all parking locations
    @GetMapping("/floors")
    public ResponseEntity<Page<ParkingFloorResponse>> getAllFloors(Pageable pageable)
    {
        log.info("Admin request to fetch all parking floors");

        try {
            return ResponseEntity.ok(parkingFloorFacade.getAllFloors(pageable));
        } catch (Exception e) {
            log.error("Failed to fetch all parking floors", e);
            throw e;
        }
    }


    // Get all non-deleted floors under a location, including inactive floors
    @GetMapping("/{locationId}/floors")
    public ResponseEntity<List<ParkingFloorResponse>> getFloorsByLocation(@PathVariable UUID locationId)
    {
        log.info("Admin request to fetch floors for location: {}", locationId);

        try {
            return ResponseEntity.ok(parkingFloorFacade.getFloorsByLocation(locationId));

        } catch (Exception e) {
            log.error("Failed to fetch floors for location: {}", locationId, e);
            throw e;
        }
    }

    // Get a floor by ID, including inactive floors
    @GetMapping("/floors/{floorId}")
    public ResponseEntity<ParkingFloorResponse> getFloorById(@PathVariable UUID floorId) {

        log.info("Admin request to fetch floor: {}", floorId);

        try {
            return ResponseEntity.ok(parkingFloorFacade.getFloorById(floorId));

        } catch (Exception e) {
            log.error("Failed to fetch floor: {}", floorId, e);
            throw e;
        }
    }

    // Update floor name and number
    @PutMapping("/floors/{floorId}")
    public ResponseEntity<ParkingFloorResponse> updateFloor(@PathVariable UUID floorId, @Valid @RequestBody ParkingFloorRequest request) {

        log.info("Admin request to update floor: {}", floorId);

        try {
            return ResponseEntity.ok(parkingFloorFacade.updateFloor(floorId, request));

        } catch (Exception e) {
            log.error("Failed to update floor: {}", floorId, e);
            throw e;
        }
    }

    // Activate or deactivate a floor
    @PatchMapping("/floors/{floorId}/status")
    public ResponseEntity<ParkingFloorResponse> updateFloorStatus(@PathVariable UUID floorId, @Valid @RequestBody ParkingFloorStatusRequest request) {

        log.info("Admin request to update status for floor: {}", floorId);

        try {
            return ResponseEntity.ok(parkingFloorFacade.updateFloorStatus(floorId, request));

        } catch (Exception e) {
            log.error("Failed to update floor status: {}", floorId, e);
            throw e;
        }
    }

}
