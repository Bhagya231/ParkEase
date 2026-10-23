package org.smart_parking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.Status;

@Getter
@Setter
public class LocationStatusRequest
{
    @NotNull(message = "Location status is required")
    private Status status;
}
