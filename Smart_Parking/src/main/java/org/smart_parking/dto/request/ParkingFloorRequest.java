package org.smart_parking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParkingFloorRequest
{
    @NotBlank(message = "Floor name is required")
    @Size(max = 50, message = "Floor name cannot exceed 50 characters")
    private String floorName;

    @NotNull(message = "Floor number is required")
    private Integer floorNumber;
}
