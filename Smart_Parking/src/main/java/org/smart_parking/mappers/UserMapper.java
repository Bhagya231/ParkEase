package org.smart_parking.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.smart_parking.dto.request.RegisterRequest;
import org.smart_parking.dto.response.LoginResponse;
import org.smart_parking.dto.response.RegisterResponse;
import org.smart_parking.entity.User;


@Mapper(componentModel = "spring")
public interface UserMapper
{

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "vehicles", ignore = true)
    @Mapping(target = "reservations", ignore = true)
    User toEntity(RegisterRequest request);


    @Mapping(target = "token", source = "token")
    @Mapping(target = "message", constant = "Registration successful")
    RegisterResponse toRegisterResponse(User user, String token);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "name", source = "user.name")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "role", source = "user.role")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "message", ignore = true)
    LoginResponse toLoginResponse(User user, String token);
}
