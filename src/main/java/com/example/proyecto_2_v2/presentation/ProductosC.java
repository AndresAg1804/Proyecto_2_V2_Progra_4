package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Producto;
import com.example.proyecto_2_v2.logic.Service;
import com.example.proyecto_2_v2.logic.Usuarios;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos")
public class ProductosC {

    @Autowired
    private Service service;

    @GetMapping("/read")
    public Iterable<Producto> read(@RequestParam String id) {
        return service.get_all_productos_de_IDprovedor(id);

    }

}
