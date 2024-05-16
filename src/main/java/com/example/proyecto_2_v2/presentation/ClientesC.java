package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Clientes;
import com.example.proyecto_2_v2.logic.Service;
import com.example.proyecto_2_v2.logic.Proveedores;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClientesC {
    @Autowired
    Service service;

    @GetMapping
    public List<Clientes> read() {
        return (List<Clientes>) service.clienteFindAll();
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
