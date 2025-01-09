package com.prestabanco.app.service;

import com.prestabanco.app.entity.Solicitud;
import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;
    private Solicitud solicitud;


    @BeforeEach
    public void setUp() {
        usuario = new Usuario();
        usuario.setIdUsuario(1L);
        usuario.setNombreCompleto("Juan Pérez");
        usuario.setFechaNacimiento(LocalDate.of(1985, 5, 20));
        usuario.setIngresosMensuales(new BigDecimal("5000"));
        usuario.setHistorialCrediticio("BUENO");
        usuario.setAntiguedadLaboral(5);
        usuario.setCapacidadAhorro("ADECUADA");
        usuario.setDeudasActuales(new BigDecimal("1000")); // Deudas por defecto

        solicitud = new Solicitud();
        solicitud.setIdSolicitud(1L);
        solicitud.setUsuario(usuario);
        solicitud.setMontoSolicitado(new BigDecimal("100000"));
        solicitud.setPlazoSolicitado(20);
        solicitud.setTasaInteres(new BigDecimal("5"));
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setEstadoSolicitud("EN_REVISION_INICIAL");
    }


    @Test
    public void testRegistrarUsuario() {
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario registrado = usuarioService.registrarUsuario(usuario);

        assertNotNull(registrado);
        assertEquals("Juan Pérez", registrado.getNombreCompleto());
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    public void testObtenerUsuarioPorId() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Juan Pérez", resultado.get().getNombreCompleto());
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    public void testObtenerUsuarioPorNombreCompleto() {
        when(usuarioRepository.findByNombreCompleto("Juan Pérez")).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorNombreCompleto("Juan Pérez");

        assertTrue(resultado.isPresent());
        assertEquals(1L, resultado.get().getIdUsuario());
        verify(usuarioRepository, times(1)).findByNombreCompleto("Juan Pérez");
    }

    @Test
    public void testObtenerTodosLosUsuarios() {
        Usuario usuario2 = new Usuario();
        usuario2.setIdUsuario(2L);
        usuario2.setNombreCompleto("María López");

        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(usuario, usuario2));

        List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();

        assertEquals(2, usuarios.size());
        verify(usuarioRepository, times(1)).findAll();
    }
}
