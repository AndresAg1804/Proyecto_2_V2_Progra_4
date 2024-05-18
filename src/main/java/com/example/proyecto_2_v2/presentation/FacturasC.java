package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Facturas;
import com.example.proyecto_2_v2.logic.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/facturas")
public class FacturasC {
    @Autowired
    Service service;

    @GetMapping("/findAll")
   public Iterable<Facturas> findAllByProveedor(@RequestParam String idP){
       Iterable<Facturas> lista=  service.findFacturasByIdProveedor(idP);
       for(Facturas factura: lista){
           factura.setProveedoresByIdProveedor(null);
            factura.setDetallesByNumFact(null);
       }
       return lista;
   }

    @GetMapping("/search")
   public Iterable<Facturas> findbyProvAndNumF(@RequestParam String idP, @RequestParam String numFact){
        Iterable<Facturas> lista = service.findAllByIdProveedorAndNumFact(idP, Integer.parseInt(numFact));
       for(Facturas factura: lista){
           factura.setProveedoresByIdProveedor(null);
           factura.setDetallesByNumFact(null);
       }
       return lista;
   }

}
