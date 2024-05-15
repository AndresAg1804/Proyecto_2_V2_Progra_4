package com.example.proyecto_2_v2.security;


import com.example.proyecto_2_v2.logic.Usuarios;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


public class UserDetailsIMP implements UserDetails{
    private Usuarios u;

    public UserDetailsIMP(Usuarios user) {
        this.u = user;
    }

    public Usuarios getUser() {
        return u;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println(u.getTipo());
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(u.getTipo()));
        return authorities;
    }

    @Override
    public String getPassword() {
        return u.getPasw();
    }

    @Override
    public String getUsername() {
        return u.getUsern();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
