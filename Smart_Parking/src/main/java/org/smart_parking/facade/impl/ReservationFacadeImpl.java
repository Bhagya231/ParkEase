package org.smart_parking.facade.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ReservationRequest;
import org.smart_parking.dto.response.ReservationResponse;
import org.smart_parking.enums.ReservationStatus;
import org.smart_parking.facade.api.ReservationFacade;
import org.smart_parking.security.CustomUserDetails;
import org.smart_parking.service.api.ReservationService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ReservationFacadeImpl implements ReservationFacade
{
    private static final Logger log = AppLogger.getLogger(ReservationFacadeImpl.class);

    private final ReservationService reservationService;


    @Override
    public ReservationResponse createReservation(ReservationRequest request)
    {

        try {

            UUID userId = getLoggedInUserId();
            log.info("request reached facade layer for creating reservation ");

            return reservationService.createReservation(userId,request);

        }catch (IllegalStateException e)
        {
            log.error("error while getting the user details in facade ");
            throw e;
        }
        catch (Exception e)
        {
            log.error("unexpected error while creating the reservation");
            throw new RuntimeException(e);
        }


    }


    @Override
    public ReservationResponse getReservationById(UUID reservationId)
    {

        

        log.info("request for the fetch reservation by id {} reached facade layer", reservationId);

        return reservationService.getReservationById(reservationId);

    }


    @Override
    public Page<ReservationResponse> getReservationsByUser(Pageable pageable)
    {
        try {
            UUID userId = getLoggedInUserId();
            log.info("request reached facade layer for the get reservation");

            return reservationService.getReservationsByUser(userId,pageable);
        }catch (IllegalArgumentException e)
        {
            log.error("error while getting user reservations ");
            throw e;
        } catch (Exception e) {
            log.error("unexpected error while getting the user reservations ");
            throw new RuntimeException(e);
        }
    }


    @Override
    public ReservationResponse cancelReservation( UUID reservationId)
    {
        try {
            UUID userId = getLoggedInUserId();

            log.info("cancel reservation {} request reached facade layer ", reservationId);

            return reservationService.cancelReservation(userId, reservationId);
        }catch (IllegalArgumentException e)
        {
            log.error("error while canceling reservation {} ",e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("unexpect error while canceling reservation {}",e.getMessage());
            throw new RuntimeException(e);
        }

    }


    @Override
    public Page<ReservationResponse> getAllReservations(ReservationStatus status, UUID locationId, Pageable pageable)
    {
        log.info("fetch all reservations reached facade layer ");

        return reservationService.getAllReservations(status,locationId,pageable );

    }


    private UUID getLoggedInUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof CustomUserDetails userDetails)) {
            throw new IllegalStateException("User is not authenticated");
        }

        return userDetails.getUserId();
    }
}
