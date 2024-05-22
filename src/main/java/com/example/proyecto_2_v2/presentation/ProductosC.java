package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Producto;
import com.example.proyecto_2_v2.security.UserDetailsIMP;
import com.example.proyecto_2_v2.logic.Proveedores;
import com.example.proyecto_2_v2.logic.Service;
import com.example.proyecto_2_v2.logic.Usuarios;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/productos")
public class ProductosC {

    @Autowired
    private Service service;

    @GetMapping("/read")
    public Iterable<Producto> read(@AuthenticationPrincipal UserDetailsIMP user) {
        return service.get_all_productos_de_IDprovedor(user.getidP());
    }


    @PostMapping("/add")
    public void save(@RequestBody Producto producto,@AuthenticationPrincipal UserDetailsIMP user) {
        try {
            Proveedores pro = service.get_ProvedorBYID(user.getidP());
            Producto search = service.findProdByIdAndProveedor(producto.getIdPr(), pro);
            if(search!=null){
                service.updateProducto(producto.getNombreP(),producto.getPrecio(),producto.getCant(),producto.getIdPr());
            }
            else {
                producto.setProveedoresByIdProd(pro);
                service.addProdcuto(producto);
            }
        }catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/buscar")
    public Iterable<Producto> buscPro(@RequestBody Producto producto,@AuthenticationPrincipal UserDetailsIMP user ){
        if(producto.getIdPr().isEmpty()){
            return service.get_all_productos_de_IDprovedor(user.getidP());
        }
        return service.findAllByProveedorIdAndProductoId(user.getidP(), producto.getIdPr());
    }


}
