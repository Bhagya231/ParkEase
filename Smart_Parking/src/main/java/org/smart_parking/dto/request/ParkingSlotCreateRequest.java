package org.smart_parking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.SlotType;
import org.smart_parking.enums.VehicleType;

@Getter
@Setter
public class ParkingSlotCreateRequest
{
    @NotBlank(message = "Section name is required")
    @Size(max = 10, message = "Section name cannot exceed 10 characters")
    private String sectionName;

    @NotNull(message = "Starting number is required")
    @Min(value = 1, message = "Starting number must be at least 1")
    private Integer startingNumber;

    @NotNull(message = "Slot count is required")
    @Min(value = 1, message = "Slot count must be at least 1")
    private Integer slotCount;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotNull(message = "Slot type is required")
    private SlotType slotType;
}
