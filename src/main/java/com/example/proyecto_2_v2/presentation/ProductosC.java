package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.Producto;
import com.example.proyecto_2_v2.logic.Proveedores;
import com.example.proyecto_2_v2.logic.Service;
import com.example.proyecto_2_v2.logic.Usuarios;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/productos")
public class ProductosC {

    @Autowired
    private Service service;

    @GetMapping("/read")
    public Iterable<Producto> read(@RequestParam String id) {
        return service.get_all_productos_de_IDprovedor(id);
    }
    /*
    * function saveProducto(){
    load_itemProducto();
    if(!validate_itemProducto()) return;//verifica que todos los campos hayan sido seleccionados
    let request = new Request(api+`/add?id=${loginstate.Usuarios.proveedoresByIdprov.idP}`, {method: 'POST', //falta hacer el metodo en el RestController
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(statePro.item)}); //creo que a esto le van a hacer falta parametros... el idpro,idPr
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}//si pasa de aqui significa que fue agregado con exito
        fetchAndListProductos();//actualiza la lista
    })();
}
    * */

    @PostMapping()
    public void save(@RequestBody Producto producto) {
        //Proveedores prove = usuario.getProveedoresByIdprov();
        try {
            //System.out.println(usern);
            System.out.println("Llego al add");



            System.out.println("set usern");
            service.addProdcuto(producto);
        }catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT);
        }

    }


}
