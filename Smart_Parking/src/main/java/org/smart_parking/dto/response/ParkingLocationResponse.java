package org.smart_parking.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.Status;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
public class ParkingLocationResponse
{
    private UUID id;

    private String locationName;
    private String address;
    private String area;

    private LocalTime openTime;
    private LocalTime closeTime;

    private Status status;

    // Floor and overall slot summary
    private long floorCount;
    private long totalSlots;
    private long availableSlots;

    // Car slots
    private long totalCarSlots;
    private long availableCarSlots;

    // Bike slots
    private long totalBikeSlots;
    private long availableBikeSlots;

    // EV slots
    private long totalEvSlots;
    private long availableEvSlots;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
