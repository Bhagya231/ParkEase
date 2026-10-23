package org.smart_parking.facade.impl;

import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingSessionEntryRequest;
import org.smart_parking.dto.response.AdminDashboardResponse;
import org.smart_parking.dto.response.ParkingSessionResponse;
import org.smart_parking.enums.Role;
import org.smart_parking.enums.SessionStatus;
import org.smart_parking.facade.api.ParkingSessionFacade;
import org.smart_parking.service.api.ParkingSessionService;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ParkingSessionFacadeImpl implements ParkingSessionFacade
{

    private static final Logger log = AppLogger.getLogger(ParkingSessionFacadeImpl.class);

    private final ParkingSessionService parkingSessionService;


    @Override
    public ParkingSessionResponse createEntry(ParkingSessionEntryRequest request, Role role) {


        log.info("Facade: Creating parking entry for reservation {}", request.getReservationId());

        try {

            if (role != Role.ADMIN)
            {
                log.warn("Unauthorized vehicle entry attempt for reservation: {}", request.getReservationId());

                throw new IllegalArgumentException("Only an admin can record vehicle entry.");
            }

            return  parkingSessionService.createEntry(request);


        } catch (IllegalArgumentException e) {
            log.error("error {} while creating vehicle entry in facade ",e.getMessage());
            throw e;
        }catch (RuntimeException e) {
            log.error("Facade: Failed to create parking entry", e);
            throw e;
        }
    }


    @Override
    public ParkingSessionResponse exitSession(UUID sessionId,Role role) {

        log.info("Facade: Exiting parking session: {}", sessionId);

        try {

            if (role != Role.ADMIN)
            {
                log.warn("Unauthorized vehicle entry attempt for session: {}", sessionId);

                throw new IllegalArgumentException("Only an admin can record vehicle exist.");
            }
            return parkingSessionService.exitSession(sessionId);

        } catch (RuntimeException e) {
            log.error("Facade: Failed to exit parking session: {}", sessionId, e);
            throw e;
        }
    }


    @Override
    public ParkingSessionResponse payForSession(UUID sessionId, UUID userId) {

        log.info("Facade: Processing payment for session: {}", sessionId);

        try {
            return parkingSessionService.payForSession(sessionId, userId);
        } catch (RuntimeException e) {
            log.error("Facade: Payment failed for session: {}", sessionId, e);
            throw e;
        }
    }

    @Override
    public AdminDashboardResponse getAdminDashboardStats()
    {
        log.info("Facade: getting teh admin dashboard details ");

        try {
            return parkingSessionService.getAdminDashboardStats();
        } catch (RuntimeException e) {
            log.error("Facade: getting admin dashboard details ", e);
            throw e;
        }

    }


    @Override
    public Page<ParkingSessionResponse> getSessions(UUID userId, Role role, SessionStatus status, Pageable pageable) {

        log.info("Facade: Fetching sessions for role: {}, user: {}, status: {}", role, userId, status);

        try {
            return parkingSessionService.getSessions(userId, role, status, pageable);
        } catch (RuntimeException e) {
            log.error("Facade: Failed to fetch parking sessions", e);
            throw e;
        }
    }


//
//
//    @Override
//    public ParkingSessionResponse getActiveSessionByUser(UUID userId) {
//
//        log.info("Facade: Fetching active session for user: {}", userId);
//
//        try {
//            return parkingSessionService.getActiveSessionByUser(userId);
//        } catch (RuntimeException exception) {
//            log.error("Facade: Failed to fetch active session for user: {}", userId, exception);
//            throw exception;
//        }
//    }

    @Override
    public ParkingSessionResponse getSessionById(UUID sessionId, UUID userId) {

        log.info("Facade: Fetching session: {}", sessionId);

        try {
            return parkingSessionService.getSessionById(sessionId, userId);
        } catch (RuntimeException e) {
            log.error("Facade: Failed to fetch session: {}", sessionId, e);
            throw e;
        }
    }




}
