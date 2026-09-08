package com.naren.erpbackend.security;

import com.naren.erpbackend.user.entity.UserProfile;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import static com.naren.erpbackend.user.entity.UserStatus.INACTIVE;
import static com.naren.erpbackend.user.entity.UserStatus.LOCKED;

@Getter
public class SecurityUser implements UserDetails {

    private final Long userId;
    private final String userName;
    private final String password;
    private final boolean accountLocked;
    private final boolean disabled;
    private final Collection<? extends GrantedAuthority> authorities;

    public SecurityUser(UserProfile user) {
        this.userId = user.getId();
        this.userName = user.getUsername();
        this.password = user.getPassword();
        this.accountLocked = user.getStatus() == LOCKED;
        this.disabled = user.getStatus() == INACTIVE;
        this.authorities = buildAuthorities(user);
    }

    private Collection<? extends GrantedAuthority> buildAuthorities(UserProfile user) {
        return user.getRoles().stream()
                .flatMap(role -> {
                    var authorities = new HashSet<GrantedAuthority>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
                    role.getPermissions().forEach(
                            permission ->
                                    authorities.add(new SimpleGrantedAuthority(permission.getName()))
                    );
                    return authorities.stream();
                }).collect(Collectors.toSet());
    }


    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !disabled;
    }
}
