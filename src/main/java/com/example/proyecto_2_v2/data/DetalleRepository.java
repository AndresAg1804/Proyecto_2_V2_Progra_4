package com.example.proyecto_2_v2.data;

import com.example.proyecto_2_v2.logic.Detalle;
import com.example.proyecto_2_v2.logic.Facturas;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleRepository extends CrudRepository<Detalle, Integer> {

    @Query("select c from Detalle c")
    public List<Detalle> findAll();

    Iterable<Detalle> findDetallesByFacturasByNumFact(Facturas fact);
}
