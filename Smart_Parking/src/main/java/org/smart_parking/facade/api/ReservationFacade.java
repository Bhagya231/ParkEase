package org.smart_parking.facade.api;

import org.smart_parking.dto.request.ReservationRequest;
import org.smart_parking.dto.response.ReservationResponse;
import org.smart_parking.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ReservationFacade
{
    ReservationResponse createReservation( ReservationRequest request);


    ReservationResponse getReservationById(UUID reservationId);


    Page<ReservationResponse> getReservationsByUser(Pageable pageable);


    ReservationResponse cancelReservation( UUID reservationId);

    Page<ReservationResponse> getAllReservations(ReservationStatus status, UUID locationId, Pageable pageable);
}
