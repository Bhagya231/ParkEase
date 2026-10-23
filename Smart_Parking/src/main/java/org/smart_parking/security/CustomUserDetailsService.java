package org.smart_parking.security;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.smart_parking.entity.User;
import org.smart_parking.repositoty.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService
{
    private  final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(@NonNull String email) throws UsernameNotFoundException
    {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("Username not found with email"));

        if (Boolean.TRUE.equals(user.getIsDeleted()))
        {
            throw new UsernameNotFoundException("User account is deleted");
        }

        return new CustomUserDetails(user);
    }
}
