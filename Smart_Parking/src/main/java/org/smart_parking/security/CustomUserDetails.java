package org.smart_parking.security;

import lombok.AllArgsConstructor;
import org.smart_parking.entity.User;
import org.smart_parking.enums.LoginStatus;
import org.smart_parking.enums.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails
{
    private final User users;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities()
    {
        return List.of(new SimpleGrantedAuthority("ROLE_" + users.getRole().name()));
    }

    @Override
    public String getPassword() {
        return users.getPassword();
    }

    @Override
    public String getUsername() {
        return users.getEmail();
    }

    public Role getRole()
    {
        return  users.getRole();
    }

    public UUID getUserId() {
        return users.getId();
    }

    public LoginStatus getLoginStatus() {
        return users.getLoginStatus();
    }

    @Override
    public boolean isEnabled()
    {
        return !Boolean.TRUE.equals(users.getIsDeleted());
    }


}
