package org.smart_parking.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.Status;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "parking_floors")
public class ParkingFloor extends BaseEntity
{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private ParkingLocation location;

    @Column(name = "floor_name", nullable = false, length = 50)
    private String floorName;

    @Column(name = "floor_number", nullable = false)
    private Integer floorNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.INACTIVE;

    @OneToMany(mappedBy = "floor")
    private List<ParkingSlots> slots = new ArrayList<>();
}
