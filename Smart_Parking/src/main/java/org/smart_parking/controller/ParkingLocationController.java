package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.LocationStatusRequest;
import org.smart_parking.dto.request.ParkingLocationRequest;
import org.smart_parking.dto.request.ParkingLocationSearchRequest;

import org.smart_parking.dto.response.ParkingLocationResponse;

import org.smart_parking.facade.api.ParkingLocationFacade;
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
public class ParkingLocationController
{
    private static final Logger log = AppLogger.getLogger(ParkingLocationController.class);


    private final ParkingLocationFacade parkingLocationFacade;



    @PostMapping("/locations")
    public ResponseEntity<ParkingLocationResponse> createLocation(@Valid @RequestBody ParkingLocationRequest request)
    {

        log.info("Admin request received to create parking location {}", request.getLocationName());

        ParkingLocationResponse response = parkingLocationFacade.createLocation(request);

        log.info(" creating location is completed successfully with id {}",response.getId());


        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    // Get/search parking locations
    @GetMapping("/locations")
    public ResponseEntity<Page<ParkingLocationResponse>> getAllLocations(@Valid @ModelAttribute ParkingLocationSearchRequest request, Pageable pageable)
    {

        log.info("Admin request received to fetch parking locations");

        Page<ParkingLocationResponse> response =  parkingLocationFacade.getAllLocations(request,pageable);

        log.info("fetching all locations completed successfully ");


        return ResponseEntity.ok(response);
    }


    @GetMapping("/locations/{id}")
    public ResponseEntity<ParkingLocationResponse> getLocationById(@PathVariable UUID id)
    {

        log.info("Admin request received to fetch location ID: {}",id);


        ParkingLocationResponse response = parkingLocationFacade.getLocationById(id);

        log.info("fetching location by id {} is completed ",id);

        return ResponseEntity.ok(response);
    }


    @PutMapping("/locations/{id}")
    public ResponseEntity<ParkingLocationResponse> updateLocation(@PathVariable UUID id,@Valid @RequestBody ParkingLocationRequest request)
    {

        log.info("Admin request received to update location ID: {}",id);

        ParkingLocationResponse response = parkingLocationFacade.updateLocation(id, request);

        log.info("updating location is completed with id {} ", id);

        return ResponseEntity.ok(response);
    }






    // Activate or deactivate a parking location
    @PatchMapping("/locations/{id}/status")
    public ResponseEntity<ParkingLocationResponse> updateLocationStatus(@PathVariable UUID id,@Valid @RequestBody LocationStatusRequest request)
    {

        log.info("Admin request received to update location status: {}",id);


        ParkingLocationResponse response =  parkingLocationFacade.updateLocationStatus(id,request);

        log.info("changing location status is completed successfully with id {}",id);

        return ResponseEntity.ok(response);
    }




}
