package org.smart_parking.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AdminDashboardResponse
{
    private long totalLocations;

    private long availableSlots;

    private long occupiedSlots;

    private long activeSessions;

    private BigDecimal totalRevenue;
}
