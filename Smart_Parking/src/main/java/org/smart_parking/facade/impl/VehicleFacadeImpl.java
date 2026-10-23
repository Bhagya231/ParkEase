package org.smart_parking.facade.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.VehicleRequest;
import org.smart_parking.dto.response.VehicleResponse;
import org.smart_parking.facade.api.VehicleFacade;
import org.smart_parking.security.CustomUserDetails;
import org.smart_parking.service.api.VehicleService;
import org.smart_parking.util.AppLogger;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class VehicleFacadeImpl  implements VehicleFacade
{

    private final static Logger log = AppLogger.getLogger(VehicleFacadeImpl.class);

    private final VehicleService vehicleService;

    private UUID getLoggedInUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            return userDetails.getUserId();

        } catch (Exception exception) {
            log.error("Failed to get authenticated user: {}", exception.getMessage());

            throw new AuthenticationCredentialsNotFoundException("Authenticated user not found", exception);
        }
    }


    @Override
    public VehicleResponse createVehicle(VehicleRequest request)
    {
        UUID userId = getLoggedInUserId();
        return vehicleService.createVehicle(request, userId);
    }

    @Override
    public List<VehicleResponse> getMyVehicles() {
        UUID userId = getLoggedInUserId();
        return vehicleService.getMyVehicles(userId);
    }

    @Override
    public VehicleResponse getVehicleById(UUID vehicleId)
    {
        UUID userId = getLoggedInUserId();
        return vehicleService.getVehicleById(vehicleId, userId);
    }

    @Override
    public VehicleResponse updateVehicle(UUID vehicleId, VehicleRequest request)
    {

        UUID userId = getLoggedInUserId();

        return vehicleService.updateVehicle(vehicleId, request, userId);
    }

    @Override
    public void deleteVehicle(UUID vehicleId)
    {
        UUID userId = getLoggedInUserId();
        vehicleService.deleteVehicle(vehicleId, userId);
    }


}
