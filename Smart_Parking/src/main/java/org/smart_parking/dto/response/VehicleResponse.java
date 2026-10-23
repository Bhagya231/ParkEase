package org.smart_parking.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.VehicleType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class VehicleResponse
{
    private UUID id;
    private String vehicleNumber;
    private VehicleType vehicleType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
