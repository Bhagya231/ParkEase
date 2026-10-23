package org.smart_parking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class ParkingLocationRequest
{
    @NotBlank(message = "Location name is required")
    @Size(max = 100, message = "Location name cannot exceed 100 characters")
    private String locationName;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @Size(max = 100, message = "Area cannot exceed 100 characters")
    private String area;

    private LocalTime openTime;

    private LocalTime closeTime;
}
