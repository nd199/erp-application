package com.naren.erpbackend.security.service;

import com.naren.erpbackend.common.util.StringNormalizeUtil;
import com.naren.erpbackend.security.SecurityUser;
import com.naren.erpbackend.user.entity.UserProfile;
import com.naren.erpbackend.user.repository.UserProfileRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserProfileRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {

        String normalized = StringNormalizeUtil.normalize(username);

        UserProfile user = userRepository.findByUsernameWithRolesAndPermissions(normalized)
                .orElseThrow(
                        () -> new UsernameNotFoundException(
                                "User not found: " + normalized
                        )
                );

        log.debug("Loaded user: username={}, status={}, roles={}",
                user.getUsername(),
                user.getStatus(),
                user.getRoles().stream().map(r -> r.getName()).toList());

        return new SecurityUser(user);
    }
}
