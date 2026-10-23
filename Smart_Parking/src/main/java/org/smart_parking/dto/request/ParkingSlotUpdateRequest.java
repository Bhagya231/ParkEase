package org.smart_parking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.SlotType;
import org.smart_parking.enums.VehicleType;

@Getter
@Setter
public class ParkingSlotUpdateRequest
{
    @NotBlank(message = "Slot number is required")
    @Size(max = 20, message = "Slot number cannot exceed 20 characters")
    private String slotNumber;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotBlank(message = "Section name is required")
    @Size(max = 10, message = "Section name cannot exceed 10 characters")
    private String sectionName;

    @NotNull(message = "Slot type is required")
    private SlotType slotType;
}
