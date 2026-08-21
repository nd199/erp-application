package com.naren.erpbackend.user.service;

import com.naren.erpbackend.user.dto.RegRequest;
import com.naren.erpbackend.user.dto.RegResponse;
import jakarta.validation.Valid;

public interface UserMService {

    RegResponse registerUser(@Valid RegRequest regRequest);
}
