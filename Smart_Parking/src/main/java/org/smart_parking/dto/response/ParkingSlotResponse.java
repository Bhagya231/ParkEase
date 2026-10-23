package org.smart_parking.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.SlotStatus;
import org.smart_parking.enums.SlotType;
import org.smart_parking.enums.VehicleType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParkingSlotResponse
{

    private UUID id;

    private UUID locationId;
    private String locationName;

    private UUID floorId;
    private String floorName;

    private String sectionName;

    private String slotNumber;

    private VehicleType vehicleType;

    private SlotType slotType;

    private SlotStatus slotStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
