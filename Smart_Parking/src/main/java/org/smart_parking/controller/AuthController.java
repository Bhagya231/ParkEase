package org.smart_parking.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.LoginRequest;
import org.smart_parking.dto.request.ReactivateAccountRequest;
import org.smart_parking.dto.request.RegisterRequest;
import org.smart_parking.dto.response.LoginResponse;
import org.smart_parking.dto.response.LogoutResponse;
import org.smart_parking.dto.response.RegisterResponse;
import org.smart_parking.facade.api.AuthFacade;
import org.smart_parking.util.AppLogger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
@RequiredArgsConstructor
public class AuthController
{
    private static final Logger log = AppLogger.getLogger(AuthController.class);

    private final AuthFacade authFacade;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request)
    {
        log.info("Registration endpoint called for email {}",request.getEmail());

        RegisterResponse response = authFacade.register(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request)
    {
        log.info("Login endpoint reached with email {}",request.getEmail());

        LoginResponse response = authFacade.login(request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount()
    {

        authFacade.deleteAccount();

        return ResponseEntity.ok("Account deleted successfully");

    }


    @PostMapping("/reactivate-account")
    public ResponseEntity<LoginResponse> reactivateAccount(@Valid @RequestBody ReactivateAccountRequest request)
    {

        log.info("Account reactivation request received for email {}", request.getEmail());

        LoginResponse response = authFacade.reactivateAccount(request);

        log.info("Account reactivation completed successfully for email {}",request.getEmail());

        return ResponseEntity.ok(response);
    }


    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout() {

        log.info("Logout API called");

        LogoutResponse response = authFacade.logout();

        return ResponseEntity.ok(response);

    }



}
