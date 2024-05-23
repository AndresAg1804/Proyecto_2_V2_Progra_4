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
    public Iterable<Clientes> buscCliente(@RequestParam String cliente, @AuthenticationPrincipal UserDetailsIMP user ){
        return service.buscarClientesPorNombreYProveedor(cliente, user.getPROVEDOR());
    }

    @PostMapping("/add")
    public void save(@RequestBody Clientes cliente,@AuthenticationPrincipal UserDetailsIMP user) {
        try {
            Clientes search = service.clienteFindByIDyProvedor(cliente.getIdC(), user.getPROVEDOR());
            if(search!=null){
                service.clienteEdit(cliente, user.getPROVEDOR());
            }
            else {
                cliente.setProveedoresByProveedorid(user.getPROVEDOR());
                service.addCliente(cliente);
            }
        }catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }

    /*@GetMapping("/{id}")
    public Clientes read(@PathVariable String id) {
        try {
            return service.clienteFindById(id);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search")
    public List<Clientes> findByNombre(@RequestParam String nombre) {
        return service.clienteFindByNombre(nombre);
    }

    @PostMapping()
    public void create(@RequestBody Clientes cliente) {
        try {
            service.clienteSave(cliente);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        try {
            service.clienteDelete(id);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/update/{id}")
    public void update(@PathVariable String id, @RequestBody Clientes cliente) {
        try {
            Clientes existingCliente = service.clienteFindById(id);
            if (existingCliente != null) {
                cliente.setIdC(id);
                service.clienteSave(cliente);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }*/
}
