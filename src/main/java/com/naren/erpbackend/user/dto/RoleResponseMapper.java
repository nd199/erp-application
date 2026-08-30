package com.naren.erpbackend.user.dto;


import com.naren.erpbackend.user.entity.Role;
import org.springframework.stereotype.Service;
import java.util.function.Function;

@Service
public class RoleResponseMapper implements Function<Role, RoleResponse> {

    @Override
    public RoleResponse apply(Role role) {

        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getDescription()
        );
    }
}
