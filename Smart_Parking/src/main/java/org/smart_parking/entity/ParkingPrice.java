package org.smart_parking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.VehicleType;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "parking_pricing")
public class ParkingPrice extends BaseEntity
{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private ParkingLocation location;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 20)
    private VehicleType vehicleType;

    @Column(name = "hour_price", nullable = false,precision = 10,scale = 2)
    private BigDecimal hourPrice;

    @Column(name = "overstay_price", nullable = false,precision = 10,scale = 2)
    private BigDecimal overstayPrice;





}
