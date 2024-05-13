package com.example.proyecto_2_v2.presentation.Usuarios;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/")
public class Controller {

    @GetMapping("")
    public String  show() {
        return "redirect:/index";
    }


}
