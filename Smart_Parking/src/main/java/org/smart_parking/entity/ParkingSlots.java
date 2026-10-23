package org.smart_parking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.SlotStatus;
import org.smart_parking.enums.SlotType;
import org.smart_parking.enums.VehicleType;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "parking_slots")
public class ParkingSlots extends BaseEntity
{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "floor_id", nullable = false)
    private ParkingFloor floor;

    @Column(name = "slot_number", nullable = false, length = 20)
    private String slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false, length = 20)
    private VehicleType vehicleType;

    @Column(name = "section_name", nullable = false, length = 10)
    private String sectionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "slot_type", nullable = false)
    private SlotType slotType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus slotStatus;

    @OneToMany(mappedBy = "slot")
    private List<Reservation> reservations = new ArrayList<>();


}
