package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Service;
import com.example.proyecto_2_v2.logic.Usuarios;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UsuariosRestCon {
    @Autowired
    Service service;
    @PostMapping("/newU")
    public Usuarios newUser(@RequestBody com.example.proyecto_2_v2.logic.Usuarios form, HttpServletRequest request) {
        var encoder = new BCryptPasswordEncoder();
        try {

            service.addUsuario(
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
    @GetMapping("/ALL")
    public List<Usuarios> allUseres(){
        List<Usuarios> g= (List<Usuarios>) service.usuariosFindAll();

        return (List<Usuarios>) service.usuariosFindAll();

    }
    @PostMapping("/AprovarDesAprovar")
    public void UPDATEAprovarDesAprovar(@RequestBody Usuarios form, HttpServletRequest request){
        service.changePRO(form.getUsern());
    }


}
