package org.smart_parking.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.Status;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParkingFloorResponse
{
    private UUID id;
    private UUID locationId;
    private  String locationName;
    private String floorName;
    private Integer floorNumber;
    private Long totalSlots;
    private Long availableSlots;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
