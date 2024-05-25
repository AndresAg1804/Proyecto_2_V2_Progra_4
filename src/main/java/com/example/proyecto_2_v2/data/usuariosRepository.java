package com.example.proyecto_2_v2.data;

import com.example.proyecto_2_v2.logic.Usuarios;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface usuariosRepository extends CrudRepository<Usuarios, String> {
    Usuarios findByUsernAndPasw(String usern,String pasw);
    Usuarios findByUsern(String usern);
    @Query("update Usuarios p set p.pasw = ?1 where p.usern = ?2")
    void update_pasw_Usuarios(String pasw, String usern);

    @Transactional
    @Modifying
    @Query("UPDATE Usuarios u SET u.pasw = ?1 WHERE u.usern = ?2")
    void updateByUsernAndPasw(String newPassword, String username);
}
