package org.smart_parking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.smart_parking.enums.Role;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse
{

    private UUID userId;
    private String name;
    private String email;
    private Role role;
    private String token;
    private String message;
}
