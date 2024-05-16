package com.example.proyecto_2_v2.security;

import com.example.proyecto_2_v2.data.usuariosRepository;
import com.example.proyecto_2_v2.logic.Usuarios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
@Service
public class UserDetailsServisIMP implements UserDetailsService {
    @Autowired
    private usuariosRepository ur;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuarios user = ur.findByUsern(username);

        if (user == null) {
            throw new UsernameNotFoundException("User " + username + " not found");
        }
        else{
            System.out.println(user.getUsern());
        }
        return new UserDetailsIMP(user);
    }
}
