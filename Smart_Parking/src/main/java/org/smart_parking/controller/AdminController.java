package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.ParkingSessionEntryRequest;
import org.smart_parking.dto.response.AdminDashboardResponse;
import org.smart_parking.dto.response.ParkingSessionResponse;
import org.smart_parking.enums.Role;
import org.smart_parking.enums.SessionStatus;
import org.smart_parking.facade.api.ParkingSessionFacade;
import org.smart_parking.security.CustomUserDetails;
import org.smart_parking.util.AppLogger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController
{

    private static final Logger log = AppLogger.getLogger(AdminController.class);

    private final ParkingSessionFacade parkingSessionFacade;



    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getAdminDashboardStats() {

        log.info("Request received to fetch admin dashboard statistics");

        AdminDashboardResponse response = parkingSessionFacade.getAdminDashboardStats();

        return ResponseEntity.ok(response);
    }



    // Start a parking session
    @PostMapping("/sessions/entry")
    public ResponseEntity<ParkingSessionResponse> createParkingSessionEntry(@Valid @RequestBody ParkingSessionEntryRequest request,
                                                                            @AuthenticationPrincipal CustomUserDetails userDetails) {

        log.info("Customer request received to start parking session");

        try {
            ParkingSessionResponse response = parkingSessionFacade.createEntry(request, userDetails.getRole());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            log.error("Failed to start parking session", e);
            throw e;
        }
    }

    // Exit a parking session
    @PostMapping("/sessions/{sessionId}/exit")
    public ResponseEntity<ParkingSessionResponse> exitParkingSession(@PathVariable UUID sessionId,
                                                                     @AuthenticationPrincipal CustomUserDetails userDetails) {

        log.info("Customer request to exit parking session: {}", sessionId);

        try {
            ParkingSessionResponse response = parkingSessionFacade.exitSession(sessionId, userDetails.getRole());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Failed to exit parking session: {}", sessionId, e);
            throw e;
        }
    }


    // Get all customers' parking sessions, optionally filtered by status
    @GetMapping("/sessions")
    public ResponseEntity<Page<ParkingSessionResponse>> getAllParkingSessions(@RequestParam(required = false) SessionStatus status,
                                                                              @AuthenticationPrincipal CustomUserDetails userDetails, Pageable pageable) {

        log.info("Admin request received to fetch parking sessions with status: {}", status);

        try {
            Page<ParkingSessionResponse> responses = parkingSessionFacade.getSessions(null, Role.ADMIN, status, pageable);

            return ResponseEntity.ok(responses);

        } catch (RuntimeException e) {
            log.error("Admin failed to fetch parking sessions", e);
            throw e;
        }
    }

}
