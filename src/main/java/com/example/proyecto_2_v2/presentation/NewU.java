package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Service;
import com.example.proyecto_2_v2.logic.Usuarios;
import com.example.proyecto_2_v2.security.UserDetailsIMP;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/user")
public class NewU {
    @Autowired
    Service s;
    @PostMapping("/newU")
    public Usuarios newUser(@RequestBody Usuarios form, HttpServletRequest request) {
        var encoder = new BCryptPasswordEncoder();
        try {

                s.addUsuario(
                        form.getUsern(),
                        "{bcrypt}" + encoder.encode(form.getPasw()),
                        form.getTipo(),
                        form.getProveedoresByIdprov().getNombreP(),
                        form.getProveedoresByIdprov().getIdP()
                );

        }
        catch (Exception e){

        }

        return new Usuarios(form.getUsern(), null, form.getTipo());
    }
}
