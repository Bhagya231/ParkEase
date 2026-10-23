package org.smart_parking.facade.api;

import org.smart_parking.dto.request.ParkingSessionEntryRequest;
import org.smart_parking.dto.response.AdminDashboardResponse;
import org.smart_parking.dto.response.ParkingSessionResponse;
import org.smart_parking.enums.Role;
import org.smart_parking.enums.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParkingSessionFacade
{

    ParkingSessionResponse createEntry(ParkingSessionEntryRequest request, Role role);


    ParkingSessionResponse exitSession(UUID sessionId, Role role);

    AdminDashboardResponse getAdminDashboardStats();


    Page<ParkingSessionResponse> getSessions(UUID userId, Role role, SessionStatus status, Pageable pageable);


    ParkingSessionResponse payForSession(UUID sessionId, UUID userId);



    ParkingSessionResponse getSessionById(UUID userId, UUID sessionId);
}
