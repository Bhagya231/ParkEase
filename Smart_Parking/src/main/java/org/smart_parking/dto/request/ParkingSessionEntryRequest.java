package org.smart_parking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ParkingSessionEntryRequest
{
    @NotNull(message = "Reservation ID is required")
    private UUID reservationId;
}
