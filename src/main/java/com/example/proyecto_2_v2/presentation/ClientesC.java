package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Clientes;
import com.example.proyecto_2_v2.logic.Producto;
import com.example.proyecto_2_v2.logic.Service;
import com.example.proyecto_2_v2.logic.Proveedores;
import com.example.proyecto_2_v2.security.UserDetailsIMP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClientesC {
    @Autowired
    Service service;

    @GetMapping("/read")
    public Iterable<Clientes> read(@AuthenticationPrincipal UserDetailsIMP user) {
        return service.clienteFindByProveedor(user.getidP());
    }

    @GetMapping("/search")
    public Iterable<Clientes> buscCliente(@RequestParam String nombre, @AuthenticationPrincipal UserDetailsIMP user ){
        return service.buscarClientesPorNombreYProveedor(nombre, user.getPROVEDOR());
    }

    @PostMapping("/add")
    public void save(@RequestBody Clientes cliente,@AuthenticationPrincipal UserDetailsIMP user, @RequestParam String mode) {
        try {
            if(mode.equals("EDIT")){
                service.clienteEdit(cliente, user.getPROVEDOR());
            }
            else {
                if(service.clienteFindByIDyProvedor(cliente.getIdC(), user.getPROVEDOR())!=null){
                    throw new ResponseStatusException(HttpStatus.CONFLICT);
                }
                cliente.setProveedoresByProveedorid(user.getPROVEDOR());
                service.addCliente(cliente);
            }
        }catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }

}
