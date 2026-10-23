package org.smart_parking.service.api;

import org.smart_parking.dto.request.ReservationRequest;
import org.smart_parking.dto.response.ReservationResponse;
import org.smart_parking.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ReservationService
{
    ReservationResponse createReservation(UUID userID, ReservationRequest request);


    ReservationResponse getReservationById(UUID reservationId);


    Page<ReservationResponse> getReservationsByUser(UUID userID, Pageable pageable);


    ReservationResponse cancelReservation(UUID userID, UUID reservationId);

    Page<ReservationResponse> getAllReservations(ReservationStatus status, UUID locationId, Pageable pageable);

    void expireReservationsInternal(LocalDateTime currentTime);
}
