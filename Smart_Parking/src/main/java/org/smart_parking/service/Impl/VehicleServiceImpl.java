package org.smart_parking.service.Impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.VehicleRequest;
import org.smart_parking.dto.response.VehicleResponse;

import org.smart_parking.entity.User;
import org.smart_parking.entity.Vehicle;
import org.smart_parking.mappers.VehicleMapper;
import org.smart_parking.repositoty.UserRepository;
import org.smart_parking.repositoty.VehicleRepository;

import org.smart_parking.service.api.VehicleService;
import org.smart_parking.util.AppLogger;


import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService
{

    private  final static Logger log = AppLogger.getLogger(VehicleServiceImpl.class);

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;


    private User getActiveUser(UUID userId) {
        return userRepository.findActiveUserById(userId.toString()).orElseThrow(() -> {
            log.info("Active user {} not found  ", userId);
           return new EntityNotFoundException("Active user not found: " + userId);
        });

    }



    private Vehicle getUserVehicle(UUID vehicleId, UUID userId)
    {
        return vehicleRepository.findVehicleByIdAndUserId(vehicleId.toString(),userId.toString())
                .orElseThrow(() -> {
                    log.error("vehicle not found with id {}", vehicleId);
                    return new EntityNotFoundException("Vehicle not found ");
                });
    }




    @Override
    public VehicleResponse createVehicle(VehicleRequest request,UUID userID)
    {

        log.info("creating the vehicle {} is started ", request.getVehicleNumber());

        String vehicleNum = request.getVehicleNumber().toUpperCase();

        try {
            User user = getActiveUser(userID);


            if(vehicleRepository.existedByVehicleNumber(vehicleNum) > 0)
            {
                log.info("vehicle is exist with the vehicle number {}",vehicleNum);
                throw new IllegalArgumentException("vehicle is exist with the vehicle number");
            }

            Vehicle vehicle = new Vehicle();
            vehicle.setUser(user);
            vehicle.setVehicleNumber(vehicleNum);
            vehicle.setVehicleType(request.getVehicleType());

            Vehicle savedVehicle = vehicleRepository.save(vehicle);

            log.info("Vehicle created successfully: {}",savedVehicle.getId());

            return vehicleMapper.toResponse(savedVehicle);


        }catch (IllegalArgumentException e)
        {
            log.error("Failed to create vehicle for user {} : {}",userID,e.getMessage());
            throw e;
        }

    }

    @Override
    public List<VehicleResponse> getMyVehicles(UUID userId)
    {
        log.info("Fetching vehicles for user: {}", userId);

        try {

            getActiveUser(userId);

            return vehicleRepository.findAllActiveVehiclesByUserId(userId.toString()).stream().map(vehicleMapper::toResponse).toList();
        } catch (Exception e) {
            log.error("error while get user vehicle ");
            throw new RuntimeException(e);
        }


    }

    @Override
    public VehicleResponse getVehicleById(UUID vehicleId, UUID userId)
    {
        log.info("Fetching vehicle {} for user {}",vehicleId, userId);

        try {
            getActiveUser(userId);

            Vehicle vehicle = getUserVehicle(vehicleId, userId);

            return vehicleMapper.toResponse(vehicle);
        }catch (RuntimeException e)
        {
            log.error("Failed to fetch vehicle {}: {}", vehicleId, e.getMessage() );
            throw e;
        }
    }

    @Override
    public VehicleResponse updateVehicle(UUID vehicleId,VehicleRequest request,UUID userId)
    {
        log.info("Updating vehicle {} for user {}",vehicleId,userId);
        try {
            getActiveUser(userId);

            Vehicle vehicle = getUserVehicle(vehicleId,userId);
            String vehicleNumber = request.getVehicleNumber();

            boolean numberChanged = !vehicle.getVehicleNumber().equalsIgnoreCase(vehicleNumber);

            if(numberChanged && vehicleRepository.existedByVehicleNumber(vehicleNumber) > 0 )
            {
                log.error("Vehicle number already exists {}", vehicleNumber);
                throw new IllegalArgumentException("Vehicle number already exists");
            }

            vehicle.setVehicleNumber(vehicleNumber);
            vehicle.setVehicleType(request.getVehicleType());

            Vehicle updatedVehicle = vehicleRepository.save(vehicle);

            log.info("Vehicle updated successfully: {}", updatedVehicle.getId());

            return vehicleMapper.toResponse(updatedVehicle);


        }catch (RuntimeException exception) {
            log.error("Failed to update vehicle {}: {}", vehicleId, exception.getMessage());
            throw exception;
        }

    }

    @Override
    public void deleteVehicle(UUID vehicleId, UUID userId) {

        log.info("Deleting vehicle {} for user {}", vehicleId, userId);

        try {
            getActiveUser(userId);

            Vehicle vehicle = getUserVehicle(vehicleId, userId);

            vehicle.setIsDeleted(true);
            vehicleRepository.save(vehicle);

            log.info("Vehicle deleted successfully: {}", vehicleId);

        } catch (RuntimeException exception) {
            log.error("Failed to delete vehicle {}: {}", vehicleId, exception.getMessage());
            throw exception;
        }
    }








}
