package org.smart_parking.repositoty;

import org.smart_parking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository  extends JpaRepository<User, UUID>
{

   @Query(value = " SELECT * FROM users WHERE email = :email", nativeQuery = true )
   Optional<User> findAllUserByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM users WHERE email = :email AND is_deleted = false", nativeQuery = true)
    Optional<User> findByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM users WHERE id = :id AND is_deleted = false", nativeQuery = true)
    Optional<User> findActiveUserById(@Param("id") String id);

}
