package com.example.proyecto_2_v2.data;


import com.example.proyecto_2_v2.logic.Proveedores;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ProveedorRepository extends CrudRepository<Proveedores, String>{

}
