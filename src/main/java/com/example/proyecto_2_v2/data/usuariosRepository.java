package com.example.proyecto_2_v2.data;

import com.example.proyecto_2_v2.logic.Usuarios;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface usuariosRepository extends CrudRepository<Usuarios, String> {
    Usuarios findByUsernAndPasw(String usern,String pasw);
    Usuarios findByUsern(String usern);

}
