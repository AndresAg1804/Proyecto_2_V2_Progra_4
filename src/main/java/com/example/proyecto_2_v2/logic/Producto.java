package com.example.proyecto_2_v2.logic;

import com.example.proyecto_2_v2.presentation.LazyFieldsFilter;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

import java.util.Collection;
import java.util.Objects;

@JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
@Entity
public class Producto {
    @Basic
    @Column(name = "nombreP")
    private String nombreP;

    @Id
    @Column(name = "id_pr")
    private String idPr;
    @Basic
    @Column(name = "precio")
    private Double precio;
    @Basic
    @Column(name = "cant")
    private Integer cant;
    @OneToMany(mappedBy = "productoByIdProd")
    private Collection<Detalle> detallesByIdPr;
    @ManyToOne
    @JoinColumn(name = "idprod", referencedColumnName = "idP")
    private Proveedores proveedoresByIdProd;


    public String getNombreP() {
        return nombreP;
    }

    public void setNombreP(String nombreP) {
        this.nombreP = nombreP;
    }

    public String getIdPr() {
        return idPr;
    }

    public void setIdPr(String idPr) {
        this.idPr = idPr;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Integer getCant() {
        return cant;
    }

    public void setCant(Integer cant) {
        this.cant = cant;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Producto producto = (Producto) o;
        return Objects.equals(nombreP, producto.nombreP) && Objects.equals(idPr, producto.idPr) && Objects.equals(precio, producto.precio) && Objects.equals(cant, producto.cant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nombreP, idPr, precio, cant);
    }

    public Collection<Detalle> getDetallesByIdPr() {
        return detallesByIdPr;
    }

    public void setDetallesByIdPr(Collection<Detalle> detallesByIdPr) {
        this.detallesByIdPr = detallesByIdPr;
    }

    public Proveedores getProveedoresByIdProd() {
        return proveedoresByIdProd;
    }

    public void setProveedoresByIdProd(Proveedores proveedoresByIdProd) {
        this.proveedoresByIdProd = proveedoresByIdProd;
    }


}
