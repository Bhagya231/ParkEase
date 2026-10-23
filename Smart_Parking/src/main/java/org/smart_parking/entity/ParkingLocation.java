package org.smart_parking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.Status;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "parking_location")
public class ParkingLocation extends BaseEntity
{
    @Column(name = "location_name", nullable = false, length = 100)
    private String locationName;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(length = 100)
    private String area;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;


    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.INACTIVE;



    @OneToMany(mappedBy = "location")
    private List<ParkingFloor> floors = new ArrayList<>();

    @OneToMany(mappedBy = "location")
    private List<ParkingPrice> pricingRules = new ArrayList<>();

}
