package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.VehicleRequest;
import org.smart_parking.dto.response.VehicleResponse;
import org.smart_parking.facade.api.VehicleFacade;
import org.smart_parking.util.AppLogger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/user/vehicles")
@RequiredArgsConstructor
public class VehicleController
{
        private static final Logger log = AppLogger.getLogger(VehicleController.class);

        private final VehicleFacade vehicleFacade;

        // Create a vehicle
        @PostMapping
        public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {

            log.info("Received request to create vehicle");

            VehicleResponse response = vehicleFacade.createVehicle(request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        // Get all vehicles belonging to the logged-in user
        @GetMapping
        public ResponseEntity<List<VehicleResponse>> getMyVehicles() {

            log.info("Received request to get logged-in user's vehicles");

            List<VehicleResponse> response = vehicleFacade.getMyVehicles();

            return ResponseEntity.ok(response);
        }

        // Get a specific vehicle
        @GetMapping("/{vehicleId}")
        public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable UUID vehicleId) {

            log.info("Received request to get vehicle: {}", vehicleId);

            VehicleResponse response = vehicleFacade.getVehicleById(vehicleId);

            return ResponseEntity.ok(response);
        }

        // Update a vehicle
        @PutMapping("/{vehicleId}")
        public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable UUID vehicleId,
                @Valid @RequestBody VehicleRequest request) {

            log.info("Received request to update vehicle: {}", vehicleId);

            VehicleResponse response = vehicleFacade.updateVehicle(vehicleId, request);

            return ResponseEntity.ok(response);
        }

        // Soft-delete a vehicle
        @DeleteMapping("/{vehicleId}")
        public ResponseEntity<Void> deleteVehicle(@PathVariable UUID vehicleId) {

            log.info("Received request to delete vehicle: {}", vehicleId);

            vehicleFacade.deleteVehicle(vehicleId);

            return ResponseEntity.noContent().build();
        }


}
