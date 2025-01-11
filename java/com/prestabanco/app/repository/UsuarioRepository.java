package com.prestabanco.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.prestabanco.app.entity.Usuario;

import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNombreCompleto(String nombreCompleto);
}