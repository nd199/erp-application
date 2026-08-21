package com.naren.erpbackend.user.dto;

import com.naren.erpbackend.user.entity.UserProfile;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class RegResponseMapper implements Function<UserProfile, RegResponse> {

    @Override
    public RegResponse apply(UserProfile userProfile) {
        return new RegResponse(
                userProfile.getUsername(),
                userProfile.getEmail(),
                userProfile.getPhone(),
                userProfile.getAddress(),
                userProfile.getCreatedAt(),
                userProfile.getLastUpdated()
        );
    }
}
