package org.smart_parking.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.PaymentStatus;
import org.smart_parking.enums.SessionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ParkingSessionResponse
{
    private UUID id;

    private UUID reservationId;
    private String reservationNumber;

    private UUID userId;
    private String customerName;
    private String customerEmail;

    private UUID vehicleId;
    private String vehicleNumber;
    private String vehicleType;

    private UUID slotId;
    private String slotNumber;
    private String locationName;
    private String address;
    private String floorName;

    private LocalDateTime entryTime;
    private LocalDateTime exitTime;

    private Long durationMinutes;

    private BigDecimal normalAmount;
    private BigDecimal overstayAmount;
    private BigDecimal parking_amount;

    private PaymentStatus paymentStatus;
    private SessionStatus sessionStatus;
}
