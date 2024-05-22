package com.example.proyecto_2_v2.presentation;

import com.example.proyecto_2_v2.logic.*;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.example.proyecto_2_v2.security.UserDetailsIMP;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@RestController
@RequestMapping("/api/facturas")
public class FacturasC {
    @Autowired
    Service service;

    @GetMapping("/findAll")
   public Iterable<Facturas> findAllByProveedor(@AuthenticationPrincipal UserDetailsIMP user){

        return service.findFacturasByIdProveedor(user.getPROVEDOR().getIdP());
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

    @GetMapping("/{numFact}/pdf")
    public void pdf(@PathVariable int numFact, HttpServletResponse response) {
        try {
            response.addHeader("Content-type","application/pdf");
            Facturas facturas = service.get_FacturaXid(numFact);

            response.setHeader("Content-Disposition", "inline; filename=Factura" + numFact + ".pdf");

            // Initialize the PDF writer and document
            PdfWriter writer = new PdfWriter(response.getOutputStream());
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            // Add title of invoice
            Paragraph title = new Paragraph("Factura #" + facturas.getNumFact());
            title.setTextAlignment(TextAlignment.CENTER);
            document.add(title);

            // Create table
            Table table = new Table(5);

            // Add table headers
            table.addCell(new Paragraph("Código"));
            table.addCell(new Paragraph( "Nombre"));
            table.addCell(new Paragraph( "Valor por unidad"));
            table.addCell(new Paragraph( "Cantidad"));
            table.addCell(new Paragraph( "Valor final"));

            // Add customer and supplier information
            document.add(new Paragraph( "Cliente: " + (facturas.getClientesByIdCliente().getNombreC())));
            document.add(new Paragraph( "Proveedor: " + (facturas.getProveedoresByIdProveedor().getNombreP())));

            // Add invoice details to the table
            Iterable<Detalle> detallesFactura = service.findDetallesByFacturaNumFact(numFact);
            for (Detalle detalle : detallesFactura) {
                Producto producto = (detalle.getProductoByIdProd());  // Store product details in a variable
                table.addCell(new Paragraph( producto.getIdPr()));
                table.addCell(new Paragraph(producto.getNombreP()));
                table.addCell(new Paragraph(String.valueOf(producto.getPrecio())));
                table.addCell(new Paragraph( String.valueOf(detalle.getCantidad())));
                table.addCell(new Paragraph( String.valueOf(detalle.getMonto())));
            }

            // Add the table to the document
            document.add(table);

            // Add total to the right of the document
            Paragraph total = new Paragraph("Total: " + facturas.getTotal());
            total.setTextAlignment(TextAlignment.RIGHT);
            document.add(total);

            // Close the document
            document.close();
        } catch (Exception e) {
            // Handle potential exceptions during PDF generation
            e.printStackTrace();
        }
    }
}
