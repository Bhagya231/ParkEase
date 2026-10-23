package org.smart_parking.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.VehicleType;

import java.math.BigDecimal;

@Getter
@Setter
public class ParkingPriceRequest
{
    @NotNull(message = "Vehicle type is required")
    VehicleType vehicleType;

    @NotNull(message = "Hourly price is required")
    @DecimalMin(value = "1.00", message = "Hourly price must be greater than zero")
    @Digits(integer = 8, fraction = 2, message = "Hourly price must have at most 8 integer digits and 2 decimal places")
    BigDecimal hourPrice;

    @NotNull(message = "Overstay price is required")
    @DecimalMin(value = "1.00", message = "Overstay price must be greater than zero")
    @Digits(integer = 8, fraction = 2, message = "Hourly price must have at most 8 integer digits and 2 decimal places")
    BigDecimal overstayPrice;
}
