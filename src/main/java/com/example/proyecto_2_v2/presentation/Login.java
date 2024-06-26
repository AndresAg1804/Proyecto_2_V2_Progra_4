package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Usuarios;
import com.example.proyecto_2_v2.security.UserDetailsIMP;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/login")
public class Login {
    @PostMapping("/login")
    public Usuarios login(@RequestBody Usuarios form, HttpServletRequest request) {
        try {
            request.login(form.getUsern(), form.getPasw());
        } catch (ServletException e) {

            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        Authentication auth = (Authentication) request.getUserPrincipal();
        Usuarios user = ((UserDetailsIMP) auth.getPrincipal()).getUser();
        return new Usuarios(user.getUsern(), null, user.getTipo());
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request) {
        try {
            request.logout();
        } catch (ServletException e) {
        }
    }
    @GetMapping("/ua")
    public ResponseEntity<Usuarios> getCurrentUser(@AuthenticationPrincipal UserDetailsIMP user) {

        if(user!=null) {
            Usuarios usuario = new Usuarios(user.getUser().getUsern(), null, user.getUser().getTipo());
            usuario.setProveedoresByIdprov(user.getPROVEDOR());
            return ResponseEntity.ok(usuario);
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

}

