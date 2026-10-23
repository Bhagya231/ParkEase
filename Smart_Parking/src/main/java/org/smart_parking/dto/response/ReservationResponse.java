package org.smart_parking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.smart_parking.enums.ReservationStatus;
import org.smart_parking.enums.VehicleType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse
{
    private UUID id;
    private String reservationNumber;

    private UUID locationId;
    private String locationName;

    private UUID floorId;
    private String floorName;

    private UUID slotId;
    private String slotNumber;

    private UUID vehicleId;
    private String vehicleNumber;
    private VehicleType vehicleType;

    private LocalDateTime startTime;
    private LocalDateTime endTime;


    private ReservationStatus reservationStatus;

    private LocalDateTime createdAt;
}
