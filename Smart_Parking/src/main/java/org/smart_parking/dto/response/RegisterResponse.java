package org.smart_parking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class RegisterResponse
{
    private UUID userId;
    private String name;
    private String email;
    private String role;
    private String token;
    private String message;
}
