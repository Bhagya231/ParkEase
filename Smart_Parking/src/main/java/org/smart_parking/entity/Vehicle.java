package org.smart_parking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.VehicleType;


@Entity
@Table(name = "vehicles")
@Getter
@Setter
public class Vehicle extends BaseEntity
{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Column(name = "vehicle_number", nullable = false, unique = true, length = 20)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

//    @Column(name = "vehicle_model", length = 50)
//    private String vehicleModel;






}
