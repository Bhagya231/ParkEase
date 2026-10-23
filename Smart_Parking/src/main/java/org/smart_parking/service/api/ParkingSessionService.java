package org.smart_parking.service.api;

import org.smart_parking.dto.request.ParkingSessionEntryRequest;
import org.smart_parking.dto.response.AdminDashboardResponse;
import org.smart_parking.dto.response.ParkingSessionResponse;
import org.smart_parking.enums.Role;
import org.smart_parking.enums.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



import java.util.UUID;

public interface ParkingSessionService
{


    // Record vehicle entry and create a parking session
    ParkingSessionResponse createEntry(ParkingSessionEntryRequest request);

    // Record vehicle exit and calculate final parking charges
    ParkingSessionResponse exitSession(UUID sessionId);

    AdminDashboardResponse getAdminDashboardStats();

    Page<ParkingSessionResponse> getSessions(UUID userId, Role role, SessionStatus status, Pageable pageable);

//    // Get all parking sessions belonging to a customer
//    List<ParkingSessionResponse> getSessionsByUser(UUID userId);
//
//    List<ParkingSessionResponse> getActiveSessions();
//
//    // Get the customer's currently active parking session
//    ParkingSessionResponse getActiveSessionByUser(UUID userId);

    ParkingSessionResponse payForSession(UUID sessionId, UUID userId);


    // Get a specific session after verifying customer ownership
    ParkingSessionResponse getSessionById( UUID sessionId,UUID userId);
}
