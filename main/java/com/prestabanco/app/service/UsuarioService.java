package com.prestabanco.app.service;

import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario registrarUsuario(Usuario usuario) {
        usuario.setFechaRegistro(LocalDateTime.now());
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> obtenerUsuarioPorId(Long idUsuario) {
        return usuarioRepository.findById(idUsuario);
    }

    public Optional<Usuario> obtenerUsuarioPorNombreCompleto(String nombreCompleto) {
        return usuarioRepository.findByNombreCompleto(nombreCompleto);
    }

    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

}
