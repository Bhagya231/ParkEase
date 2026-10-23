package org.smart_parking.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.smart_parking.enums.LoginStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter
{

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException
    {

        //  Look for the "Authorization" header in the incoming request
        String authHeader = request.getHeader("Authorization");

        // if Authorization header is missing or doesn't contain Bearer token
        if(authHeader == null || !authHeader.startsWith("Bearer "))
        {
            filterChain.doFilter(request, response);
            return;
        }

        // Remove "Bearer " and keep only the JWT token
        String token = authHeader.substring(7);

        try {
            String email = jwtUtils.extractEmail(token);

            // Checking  user is already authenticated
            if(email != null && SecurityContextHolder.getContext().getAuthentication() == null)
            {
                // Fetch  user details from the database
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                System.out.println("JWT User: " + userDetails.getUsername());
                System.out.println("Authorities: " + userDetails.getAuthorities());
                System.out.println("Enabled: " + userDetails.isEnabled());

//                (userDetails instanceof CustomUserDetails custom ? custom.getLoginStatus() : "Not CustomUserDetails"));
                System.out.println("Token Valid: " + jwtUtils.isTokenValid(token, userDetails));


                if (userDetails instanceof CustomUserDetails customUserDetails && LoginStatus.LOGGED_OUT.equals(customUserDetails.getLoginStatus())) {

                    SecurityContextHolder.clearContext();

                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("text/plain");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write("User is logged out. Please login again.");

//                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User is logged out. Please log in again.");
                    return;
                }

                //  Check if the token is valid for this specific user
                if(userDetails.isEnabled() && jwtUtils.isTokenValid(token, userDetails))
                {
                    //  Create an authentication object containing the user and their roles
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    //  Save the authentication object in the SecurityContext.
                    // Now Spring knows exactly who is logged in and what roles they have.
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Invalid or expired token");

                    return;
                }
            }

        }catch (JwtException | IllegalArgumentException | UsernameNotFoundException e)
        {
            SecurityContextHolder.clearContext();

            response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Invalid or expired token");
            return;
        }


        // Continue the request to the next filter
        filterChain.doFilter(request, response);
    }

}
