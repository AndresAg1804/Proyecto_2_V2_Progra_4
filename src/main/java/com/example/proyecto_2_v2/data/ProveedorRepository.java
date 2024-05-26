package com.example.proyecto_2_v2.data;


import com.example.proyecto_2_v2.logic.Proveedores;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProveedorRepository extends CrudRepository<Proveedores, String>{
    @Transactional
    @Modifying
    @Query("update Proveedores p set p.nombreP = ?1  where p.idP = ?2")
    void update_nombreP_Proveedor(String nombreP,String idPr);

    Proveedores findByIdP(String idP);
}
