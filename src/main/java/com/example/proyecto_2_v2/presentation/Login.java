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
            System.out.printf("Juan Pablo Cartin");
            request.login(form.getUsern(), form.getPasw());//pero no entiendo donde esta defindio este metod en relacion a el UserRepository ???
        } catch (ServletException e) {
            System.out.println("Okay but why" );
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        System.out.println("Okay I can work this this.........");
        Authentication auth = (Authentication) request.getUserPrincipal();
        Usuarios user = ((UserDetailsIMP) auth.getPrincipal()).getUser();
        System.out.println("no way");
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
            return ResponseEntity.ok(usuario);
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

}

