package org.smart_parking.facade.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.LoginRequest;
import org.smart_parking.dto.request.ReactivateAccountRequest;
import org.smart_parking.dto.request.RegisterRequest;
import org.smart_parking.dto.response.LoginResponse;
import org.smart_parking.dto.response.LogoutResponse;
import org.smart_parking.dto.response.RegisterResponse;
import org.smart_parking.facade.api.AuthFacade;
import org.smart_parking.service.api.AuthService;
import org.smart_parking.util.AppLogger;
import org.springframework.stereotype.Component;



@Component
@RequiredArgsConstructor
public class AuthFacadeImpl implements AuthFacade
{

    private static final Logger log = AppLogger.getLogger(AuthFacadeImpl.class);

    private final AuthService authService;

    @Override
    public RegisterResponse register(RegisterRequest request) {

        log.info("Registration request received by facade for email {}",request.getEmail());

        return authService.register(request);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        log.info("Login request received by facade for user email {}",request.getEmail());

        return authService.login(request);
    }

    public void deleteAccount()
    {
        log.info("Deleting request reached facade ");
        authService.deleteAccount();

    }

    @Override
    public LoginResponse reactivateAccount(ReactivateAccountRequest request)
    {
        log.info("Account reactivation request received for email {}",request.getEmail());
        return authService.reactivateAccount(request);
    }

    @Override
    public LogoutResponse logout()
    {
        log.info("Logout request received");
        return authService.logout();
    }

}
