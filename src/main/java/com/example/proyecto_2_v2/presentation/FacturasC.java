package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Facturas;
import com.example.proyecto_2_v2.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/facturas")
public class FacturasC {
    @Autowired
    Service service;

   public Iterable<Facturas> findAllByProveedor(@PathVariable String idP){
       Iterable<Facturas> lista=  service.findFacturasByIdProveedor(idP);


       return lista; 

   }

}
