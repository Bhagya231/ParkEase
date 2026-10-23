package org.smart_parking.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.SlotStatus;
import org.smart_parking.enums.SlotType;
import org.smart_parking.enums.VehicleType;

import java.time.LocalDateTime;

@Getter
@Setter
public class ParkingSlotSearchRequest
{
    private VehicleType vehicleType;

    private SlotType slotType;

    private String sectionName;

    private SlotStatus slotStatus;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}
