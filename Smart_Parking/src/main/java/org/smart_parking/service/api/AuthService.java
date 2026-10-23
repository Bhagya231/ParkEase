package org.smart_parking.service.api;

import org.smart_parking.dto.request.LoginRequest;
import org.smart_parking.dto.request.ReactivateAccountRequest;
import org.smart_parking.dto.request.RegisterRequest;
import org.smart_parking.dto.response.LoginResponse;
import org.smart_parking.dto.response.LogoutResponse;
import org.smart_parking.dto.response.RegisterResponse;



public interface AuthService
{

    RegisterResponse register(RegisterRequest request);

    LoginResponse reactivateAccount(ReactivateAccountRequest request);

    LoginResponse login(LoginRequest request);

    void deleteAccount();

    LogoutResponse logout();
}
