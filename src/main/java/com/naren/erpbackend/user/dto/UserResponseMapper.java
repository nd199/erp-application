package com.naren.erpbackend.user.dto;


import com.naren.erpbackend.user.entity.UserProfile;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class UserResponseMapper implements Function<UserProfile, UserResponse> {

    @Override
    public UserResponse apply(UserProfile userProfile) {
        return
                new UserResponse(
                        userProfile.getId(),
                        userProfile.getUsername(),
                        userProfile.getEmail(),
                        userProfile.getCreatedAt(),
                        userProfile.getLastUpdated()
                );
    }
}
