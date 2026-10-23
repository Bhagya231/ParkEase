package org.smart_parking.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.LoginStatus;
import org.smart_parking.enums.Role;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity
{

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 15)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LoginStatus loginStatus = LoginStatus.LOGGED_OUT;

    @OneToMany(mappedBy = "user")
    private List<Vehicle> vehicles = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<Reservation> reservations = new ArrayList<>();

}
