package org.smart_parking.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParkingLocationSearchRequest
{

    @Size(max = 100, message = "Search cannot exceed 100 characters")
    private String search;

    @Pattern(regexp = "(?i)ALL|ACTIVE|INACTIVE",message = "Status must be one of: ALL, ACTIVE, INACTIVE")
    private String filter = "ALL";
}
