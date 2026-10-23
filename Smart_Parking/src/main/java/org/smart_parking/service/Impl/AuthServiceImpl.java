package org.smart_parking.service.Impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.smart_parking.dto.request.LoginRequest;
import org.smart_parking.dto.request.ReactivateAccountRequest;
import org.smart_parking.dto.request.RegisterRequest;
import org.smart_parking.dto.response.LoginResponse;
import org.smart_parking.dto.response.LogoutResponse;
import org.smart_parking.dto.response.RegisterResponse;
import org.smart_parking.entity.User;
import org.smart_parking.enums.LoginStatus;
import org.smart_parking.enums.Role;
import org.smart_parking.exception.AccountDeletedException;
import org.smart_parking.exception.EmailAlreadyExistsException;
import org.smart_parking.exception.InvalidCredentialsException;
import org.smart_parking.mappers.UserMapper;
import org.smart_parking.repositoty.UserRepository;
import org.smart_parking.security.CustomUserDetails;
import org.smart_parking.security.JwtUtils;
import org.smart_parking.service.api.AuthService;
import org.smart_parking.util.AppLogger;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService
{

    private static final Logger log = AppLogger.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;


    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request)
    {

        log.info("Registation started for email {}",request.getEmail());

        User user;

        try {

            Optional<User> existinguser = userRepository.findAllUserByEmail(request.getEmail());

            if(existinguser.isPresent())
            {
                user = existinguser.get();

                if(Boolean.FALSE.equals(user.getIsDeleted()))
                {
                    log.warn("email is already registered");
                    throw new EmailAlreadyExistsException("Email is already registered");
                }else {
                    log.warn("Registration attempted for deleted account: {}",request.getEmail());
                    throw new AccountDeletedException("Your account has been deleted. Please reactivate your account to continue.");
                }

            } else {
                //create a new account

                user = userMapper.toEntity(request);
                user.setRole(Role.CUSTOMER);

                log.info("creating a new user account");

            }

            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            User savedUser = userRepository.save(user);

            log.info("Registration completed successfully with id {}", savedUser.getId() );

            // Convert User entity to UserDetails
            CustomUserDetails userDetails = new CustomUserDetails(savedUser);

            // Generate JWT
            String token = jwtUtils.generateToken(userDetails);

            RegisterResponse response = userMapper.toRegisterResponse(savedUser,token);

            return response;

        }catch (AccountDeletedException e) {
            log.warn("Registration blocked because account is deleted: {}",request.getEmail());
            throw e;
        } catch (EmailAlreadyExistsException e)
        {
            log.info("email already exist error while registering for email {}", request.getEmail());
            throw e;
        } catch (Exception e) {
            log.info("unexpected error while register user for email {} ",request.getEmail());
            throw new RuntimeException("Unexpected error while registering user with email ",e);
        }

    }



    @Override
    public LoginResponse login(LoginRequest request)
    {
        log.info("Login attempt for email {} " , request.getEmail());

        try{

            // This single line securely checks both the email and the hashed password.
            // If the password is wrong, it automatically throws a BadCredentialsException.
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            User users = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> {
                log.warn("Login failed. User not found for email {} ", request.getEmail());
                throw new InvalidCredentialsException("user not register with this email");
            });


            // Update login status after successful authentication
            users.setLoginStatus(LoginStatus.LOGGED_IN);
            userRepository.save(users);

            log.info("Login status updated successfully for user ID {}", users.getId());

            // Convert User entity to UserDetails
            CustomUserDetails userDetails = new CustomUserDetails(users);

            // Generate JWT
            String token = jwtUtils.generateToken(userDetails);

            LoginResponse response = userMapper.toLoginResponse(users, token);
            response.setMessage("Login successful");

            return response;
        }catch (BadCredentialsException e) {
            // Catches the failed password check from the authenticationManager
            log.warn("Login failed. Invalid password for email: {}", request.getEmail());
            throw new InvalidCredentialsException("Invalid password try again");
        } catch (InvalidCredentialsException e)
        {
            log.warn("Login failed. user is not register with this email {} ",request.getEmail());
            throw e;

        } catch (Exception e) {

            log.error("Unexpected error during login for email: {}", request.getEmail(), e);

            throw new RuntimeException("Unable to login");
        }
    }


    public void deleteAccount()
    {

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UUID id = userDetails.getUserId();

        log.info("deleting account is started for user id {}",id);
        try {
            User user = userRepository.findActiveUserById(id.toString()).orElseThrow(() -> {
                log.info("user not found with id {}", id);
                return new UsernameNotFoundException("user account not found ");
            });

            user.setIsDeleted(true);

            userRepository.save(user);

            log.info("user account deleted successfully");
        }catch (UsernameNotFoundException e)
        {
            log.info("user account not found with id {}",id);
            throw e;
        } catch (Exception e)
        {
            log.error("Error {} while deleting user account for id {}", e,id);
            throw new RuntimeException("Unexpected error while deleting user",e);
        }
    }


    @Override
    @Transactional
    public LoginResponse reactivateAccount(ReactivateAccountRequest request) {

        log.info("Account reactivation started for email {}",request.getEmail());


        try {
            User user = userRepository.findAllUserByEmail(request.getEmail())
                    .orElseThrow(() ->
                    {
                        log.info("Invalid email. user not found with this email {}",request.getEmail() );
                        return new InvalidCredentialsException("Invalid email. user not found with this email " );
                    });

            // Verify the existing password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword()))
            {

                log.warn("Account reactivation failed: invalid password ");

                throw new InvalidCredentialsException("Invalid  password check again");

            }

            // Only deleted accounts can be reactivated
            if (!Boolean.TRUE.equals(user.getIsDeleted()))
            {
                throw new IllegalStateException("This account is already active");


            }

            // Reactivate the account
            user.setIsDeleted(false);
            User reactivatedUser = userRepository.save(user);

            // Generate a new JWT after reactivation
            CustomUserDetails userDetails =  new CustomUserDetails(reactivatedUser);


            String token = jwtUtils.generateToken(userDetails);

            log.info("Account reactivated successfully for user ID {}",reactivatedUser.getId());

            LoginResponse response = userMapper.toLoginResponse(reactivatedUser, token);
            response.setMessage("Account reactivated successfully");


            return response;

        } catch (InvalidCredentialsException e)
        {
            log.warn("user not found with email {}", request.getEmail());
            throw e;
        } catch (IllegalStateException e)
        {
            log.warn("invalid password check again ");
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during account reactivation", e);
            throw new RuntimeException("Unable to reactivate account", e);

        }


    }



    @Override
    @Transactional
    public LogoutResponse logout()
    {

        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        UUID id = userDetails.getUserId();

        log.info("Logout started for user ID {}", id);

        try {
            User user = userRepository.findActiveUserById(id.toString())
                    .orElseThrow(() -> {
                        log.warn("User account not found with id {}",id);
                        return new UsernameNotFoundException("User account not found");
                    });


            LocalDateTime logoutTime = LocalDateTime.now();

            user.setLoginStatus(LoginStatus.LOGGED_OUT);
            userRepository.save(user);


            log.info("Logout completed successfully for user ID {}", id);

            return new LogoutResponse("Logout successful", logoutTime);

        } catch (UsernameNotFoundException e) {
            log.warn("Logout failed: user not found with ID {}", id);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during logout for user ID {}", id, e);
            throw new RuntimeException("Unable to logout", e);
        }
    }



}
