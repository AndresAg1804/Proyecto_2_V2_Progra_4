package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.*;
import com.example.proyecto_2_v2.security.UserDetailsIMP;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/facturar")
public class FacturarC {


    @Autowired
    private Service service;

    @GetMapping ("/findClient")
    public Clientes findClient(@RequestParam String cliente,@AuthenticationPrincipal UserDetailsIMP user){
        return service.clienteFindByIDyProvedor(cliente, user.getPROVEDOR());
    }
    @GetMapping ("/findProducto")
    public Producto findProducto(@RequestParam String idProd,@AuthenticationPrincipal UserDetailsIMP user){
        return service.findProdByIdAndProveedor(idProd, user.getPROVEDOR());
    }
    @PostMapping  ("/guardaFact")
    public void guardaFactura(@RequestParam String clientId, @RequestParam String provId, @RequestParam String monto){
        double totalAmount = Double.parseDouble(monto);
        int tot = (int) totalAmount;
        service.guardaFactura(clientId,provId,tot);
    }

/*
    @GetMapping ("/presentation/Facturar/FindClient") //Busqueda de cliente para facturar
    public String findUserByID(@RequestParam("nombreC") @Valid String id, ){
        //model.addAttribute("cliente", service.clienteFindByID(id));
        Usuarios u= (Usuarios) session.getAttribute("usuario");
        Proveedores p= u.getProveedoresByIdprov();
        Facturas fact= (Facturas) session.getAttribute("factura");

        Clientes cli=service.clienteFindByIDyProvedor(id, p);
        session.setAttribute("cliente", cli);

        fact.setClientesByIdCliente(cli);
        session.setAttribute("factura", fact);

        return "redirect:/presentation/Facturar/show";
    }
    @GetMapping ("/presentation/Facturar/AddProduct")
    public String findProducto(@RequestParam("idP") @Valid String idProducto,HttpSession session) {

        Usuarios u = (Usuarios) session.getAttribute("usuario");
        Proveedores p = u.getProveedoresByIdprov();
        ArrayList<Detalle> detalleP = null;
        Detalle nuevo = new Detalle();
        nuevo.setCantidad(1);
        Producto prod = service.findProdByIdAndProveedor(idProducto,p);
        int monto = 0;
        detalleP=(ArrayList<Detalle>)session.getAttribute("DetallesVentaS");
        if(!service.alreadyInList(detalleP, idProducto )&& prod!=null && prod.getCant()>0){
            nuevo.setProductoByIdProd(prod);
            monto= (int) (nuevo.getProductoByIdProd().getPrecio() * nuevo.getCantidad()); //Cambiar el monto en la base de datos a un float
            nuevo.setMonto(monto);
            if(detalleP==null){
                detalleP=new ArrayList<Detalle>();
                nuevo.setProductoByIdProd(prod);
            }
            detalleP.add(nuevo);
            session.setAttribute("DetallesVentaS", detalleP);
        }

        return "redirect:/presentation/Facturar/show";
    }


    @GetMapping("/Facturar/EliminateProduct")
    public String deleteProdFromDetalle(HttpSession session, @RequestParam("idProd") String productID){
        ArrayList<Detalle> detalleP=(ArrayList<Detalle>)session.getAttribute("DetallesVentaS");
        detalleP.removeIf(detalle -> detalle.getProductoByIdProd().getIdPr().equals(productID));
        if(detalleP.size()==0){
            session.setAttribute("estado","0");
        }
        return "redirect:/presentation/Facturar/show";
    }

    @GetMapping("/Facturar/AumentarCant")
    public String aumentarCant(HttpSession session, @RequestParam("idprod")  String idprod, @RequestParam("cant") int cant){
        ArrayList<Detalle> detalleP=(ArrayList<Detalle>)session.getAttribute("DetallesVentaS");
        Usuarios u = (Usuarios) session.getAttribute("usuario");
        Proveedores p = u.getProveedoresByIdprov();
        cant+=1;
        detalleP=service.actualizaLista(detalleP,idprod,cant,p, 1);

        session.setAttribute("DetallesVentaS", detalleP);
        return "redirect:/presentation/Facturar/show";
    }

    @GetMapping("/Facturar/DisminuirCant")
    public String disminuirCant(HttpSession session, @RequestParam("idprod")  String idprod, @RequestParam("cant") int cant){
        ArrayList<Detalle> detalleP=(ArrayList<Detalle>)session.getAttribute("DetallesVentaS");
        Usuarios u = (Usuarios) session.getAttribute("usuario");
        Proveedores p = u.getProveedoresByIdprov();
        cant-=1;
        detalleP=service.actualizaLista(detalleP,idprod,cant,p, 2);

        session.setAttribute("DetallesVentaS", detalleP);
        return "redirect:/presentation/Facturar/show";
    }

    @GetMapping("/Facturar/Guardar")
    public String guardarFactura(HttpSession session){
        ArrayList<Detalle> detalleP=(ArrayList<Detalle>)session.getAttribute("DetallesVentaS");
        Facturas fact= (Facturas) session.getAttribute("factura");
        Clientes cliente = (Clientes) session.getAttribute("cliente");
        if(detalleP.size()>0 && cliente.getNombreC()!=null) {
            service.guardarFactura(fact, detalleP);
            session.setAttribute("cliente", null);
            session.setAttribute("DetallesVentaS", null);
            session.setAttribute("factura", null);
        }
        return "redirect:/presentation/Facturar/show";
    }*/
}

