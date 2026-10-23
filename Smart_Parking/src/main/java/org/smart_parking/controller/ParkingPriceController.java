package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingPriceRequest;
import org.smart_parking.dto.response.ParkingPriceResponse;
import org.smart_parking.facade.api.ParkingPriceFacade;
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
public class ParkingPriceController
{

    private static final Logger log = AppLogger.getLogger(ParkingPriceController.class);

    private final ParkingPriceFacade parkingPriceFacade;


    @PostMapping("/locations/{locationId}/pricing")
    public ResponseEntity<ParkingPriceResponse> createPrice(@PathVariable UUID locationId, @Valid @RequestBody ParkingPriceRequest request)
    {

        log.info("API: Creating parking price for location: {}", locationId);

            ParkingPriceResponse response = parkingPriceFacade.createPrice(locationId, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);


    }

    @GetMapping("/locations/{locationId}/pricing")
    public ResponseEntity<Page<ParkingPriceResponse>> getPricesByLocation(@PathVariable UUID locationId, Pageable pageable)
    {

        log.info("API: Fetching prices for location: {}", locationId);


        Page<ParkingPriceResponse> response = parkingPriceFacade.getPriceByLocation(locationId,pageable);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/pricing")
    public ResponseEntity<Page<ParkingPriceResponse>> getAllPrices(Pageable pageable)
    {
        log.info("Fetching all active parking prices");

        Page<ParkingPriceResponse> response =
                parkingPriceFacade.getAllActivePrices(pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pricing/{pricingId}")
    public ResponseEntity<ParkingPriceResponse> getPriceById(@PathVariable UUID pricingId) {

        log.info("API: Fetching parking price: {}", pricingId);


        ParkingPriceResponse response = parkingPriceFacade.getPriceById(pricingId);

        return ResponseEntity.ok(response);

    }

    @PutMapping("/pricing/{pricingId}")
    public ResponseEntity<ParkingPriceResponse> updatePrice(@PathVariable UUID pricingId, @Valid @RequestBody ParkingPriceRequest request) {

        log.info("API: Updating parking price: {}", pricingId);


            ParkingPriceResponse response = parkingPriceFacade.updatePrice(pricingId, request);

            return ResponseEntity.ok(response);


    }
}
