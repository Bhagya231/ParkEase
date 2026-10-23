package org.smart_parking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class LogoutResponse
{
    private String message;
    private LocalDateTime logoutTime;

}
