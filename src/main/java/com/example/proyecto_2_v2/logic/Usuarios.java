package com.example.proyecto_2_v2.logic;

import com.example.proyecto_2_v2.presentation.LazyFieldsFilter;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

import java.util.Objects;

@JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
@Entity
public class Usuarios {

    @Id
    @Column(name = "usern")
    private String usern;
    @Basic
    @Column(name = "pasw")
    private String pasw;
    @Basic
    @Column(name = "tipo")
    private String tipo;
    @ManyToOne
    @JoinColumn(name = "idprov", referencedColumnName = "idP")
    private Proveedores proveedoresByIdprov;

    public Usuarios(String usern,String pasw,String tipo) {
        this.usern = usern;
        this.pasw = pasw;
        this.tipo = tipo;
    }

    public Usuarios() {
        this.usern = "";
        this.pasw = "";
        this.tipo = "";
    }

    public String getUsern() {
        return usern;
    }

    public void setUsern(String usern) {
        this.usern = usern;
    }

    public String getPasw() {
        return pasw;
    }

    public void setPasw(String pasw) {
        this.pasw = pasw;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuarios usuarios = (Usuarios) o;
        return Objects.equals(usern, usuarios.usern) && Objects.equals(pasw, usuarios.pasw) && Objects.equals(tipo, usuarios.tipo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usern, pasw, tipo);
    }

    public Proveedores getProveedoresByIdprov() {
        return proveedoresByIdprov;
    }

    public void setProveedoresByIdprov(Proveedores proveedoresByIdprov) {
        this.proveedoresByIdprov = proveedoresByIdprov;
    }

    public Usuarios clone(){
        return new Usuarios(usern,pasw,tipo);
    }
}
