package org.smart_parking.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;


import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils
{
    @Value("${jwt.secret}")
    private String secret; // secret must be at least 256 bits (32 characters)

    @Value("${jwt.expiration}")
    private long expiration; // valid time for token


    // Generates the cryptographic key from our secret string
    private SecretKey getSigningKey()
    {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        return Keys.hmacShaKeyFor(keyBytes);

    }

    // jwt token creation with user email and expiration  as payload
    public String generateToken(UserDetails userDetails)
    {

        Map<String, Object> claims = new HashMap<>();
        String role = userDetails.getAuthorities().stream()
                .findFirst().map(GrantedAuthority::getAuthority).orElse(null);

        if (role != null)
        {
            role = role.replaceFirst("^ROLE_","");
            claims.put("role", role);

        }

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }


    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    // Extracts specific data (claims) from the token
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver)
    {
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    // Extracts the email from the token's payload
    public String extractEmail(String token)
    {
        return extractClaim(token, Claims::getSubject);
    }

    // Checks if the token belongs to the user and has not expired
    public boolean isTokenValid(String token, UserDetails userDetails)
    {
        final String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // checking token expired or not
    private boolean isTokenExpired(String token) {

        return extractClaim(token, Claims::getExpiration)
                .before(new Date());
    }



}
