package com.prestabanco.app.repository;

import com.prestabanco.app.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.prestabanco.app.entity.Solicitud;
import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByUsuario(Usuario usuario);
}