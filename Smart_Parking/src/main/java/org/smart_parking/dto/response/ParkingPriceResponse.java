package org.smart_parking.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.VehicleType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParkingPriceResponse
{
    private UUID id;

    private UUID locationId;

    private String locationName;

    private VehicleType vehicleType;

    private BigDecimal hourPrice;

    private BigDecimal overstayPrice;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
