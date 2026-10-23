package org.smart_parking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.SlotStatus;

@Getter
@Setter
public class ParkingSlotStatusRequest
{
    @NotNull(message = "Slot status is required")
    private SlotStatus slotStatus;


}
