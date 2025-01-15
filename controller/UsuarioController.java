package com.prestabanco.app.controller;

import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.exception.ResourceNotFoundException;
import com.prestabanco.app.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registrar")
    public Usuario registrarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.registrarUsuario(usuario);
    }

    @GetMapping("/{id}")
    public Optional<Usuario> obtenerUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(id);
        if (usuarioOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuario no encontrado para ID: " + id);
        }
        return usuarioOpt;
    }

    @GetMapping("/nombre/{nombreCompleto}")
    public Optional<Usuario> obtenerUsuarioPorNombreCompleto(@PathVariable String nombreCompleto) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorNombreCompleto(nombreCompleto);
        if (usuarioOpt.isEmpty()) {
            throw new ResourceNotFoundException("Usuario no encontrado para nombreCompleto: " + nombreCompleto);
        }
        return usuarioOpt;
    }

    @GetMapping
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioService.obtenerTodosLosUsuarios();
    }
}
