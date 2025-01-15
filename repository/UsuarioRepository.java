package com.prestabanco.app.repository;

import com.prestabanco.app.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNombreCompleto(String nombreCompleto);
}
