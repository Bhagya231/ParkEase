package org.smart_parking.facade.api;

import org.smart_parking.dto.request.LoginRequest;
import org.smart_parking.dto.request.ReactivateAccountRequest;
import org.smart_parking.dto.request.RegisterRequest;
import org.smart_parking.dto.response.LoginResponse;
import org.smart_parking.dto.response.LogoutResponse;
import org.smart_parking.dto.response.RegisterResponse;

import java.util.UUID;

public interface AuthFacade
{
    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void deleteAccount();

    LoginResponse reactivateAccount(ReactivateAccountRequest request);

    LogoutResponse logout();
}
