package com.prestabanco.app.service;

import com.prestabanco.app.entity.Solicitud;
import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.repository.SolicitudRepository;
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
public class SolicitudServiceTest {

    @Mock
    private SolicitudRepository solicitudRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private SolicitudService solicitudService;

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
    public void testCrearSolicitud() {
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        Solicitud creada = solicitudService.crearSolicitud(solicitud);

        assertNotNull(creada);
        assertEquals("EN_REVISION_INICIAL", creada.getEstadoSolicitud());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    public void testObtenerSolicitudPorId() {
        when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitud));

        Optional<Solicitud> resultado = solicitudService.obtenerSolicitudPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals(new BigDecimal("100000"), resultado.get().getMontoSolicitado());
        verify(solicitudRepository, times(1)).findById(1L);
    }

    @Test
    public void testObtenerSolicitudesPorUsuario() {
        when(solicitudRepository.findByUsuario(usuario)).thenReturn(Arrays.asList(solicitud));

        List<Solicitud> solicitudes = solicitudService.obtenerSolicitudesPorUsuario(usuario);

        assertEquals(1, solicitudes.size());
        verify(solicitudRepository, times(1)).findByUsuario(usuario);
    }

    @Test
    public void testObtenerTodasLasSolicitudes() {
        Solicitud solicitud2 = new Solicitud();
        solicitud2.setIdSolicitud(2L);

        when(solicitudRepository.findAll()).thenReturn(Arrays.asList(solicitud, solicitud2));

        List<Solicitud> solicitudes = solicitudService.obtenerTodasLasSolicitudes();

        assertEquals(2, solicitudes.size());
        verify(solicitudRepository, times(1)).findAll();
    }

    @Test
    public void testActualizarSolicitud() {
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        solicitud.setEstadoSolicitud("APROBADA");
        Solicitud actualizada = solicitudService.actualizarSolicitud(solicitud);

        assertEquals("APROBADA", actualizada.getEstadoSolicitud());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    public void testEvaluarSolicitud_Aprobada() {
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("APROBADA", resultado);
        assertEquals("APROBADA", solicitud.getEstadoSolicitud());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    public void testEvaluarSolicitud_RechazadaPorRelacionCuotaIngreso() {
        // Modificamos los ingresos mensuales para que la relación cuota/ingreso exceda el 40%
        usuario.setIngresosMensuales(new BigDecimal("1000"));

        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("RECHAZADA", resultado);
        assertEquals("RECHAZADA", solicitud.getEstadoSolicitud());
        assertEquals("Relación cuota/ingreso excede el 40%", solicitud.getComentariosSeguimiento());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    public void testEvaluarSolicitud_RechazadaPorRelacionDeudaIngreso() {
        // Establecemos deudas actuales que representen más del 50% de los ingresos
        usuario.setIngresosMensuales(new BigDecimal("5000"));
        usuario.setDeudasActuales(new BigDecimal("3000")); // 3000 / 5000 = 0.60 (60%)

        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("RECHAZADA", resultado);
        assertEquals("RECHAZADA", solicitud.getEstadoSolicitud());
        assertEquals("Relación deuda/ingreso excede el 50%", solicitud.getComentariosSeguimiento());
        verify(solicitudRepository, times(1)).save(solicitud);
    }


    @Test
    public void testEvaluarSolicitud_RechazadaPorHistorialCrediticio() {
        usuario.setHistorialCrediticio("MALO");

        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("RECHAZADA", resultado);
        assertEquals("RECHAZADA", solicitud.getEstadoSolicitud());
        assertEquals("Calificación crediticia insuficiente", solicitud.getComentariosSeguimiento());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    public void testEvaluarSolicitud_RechazadaPorPlazo() {
        solicitud.setPlazoSolicitado(35); // Excede los 30 años permitidos

        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("RECHAZADA", resultado);
        assertEquals("RECHAZADA", solicitud.getEstadoSolicitud());
        assertEquals("Plazo solicitado excede los 30 años", solicitud.getComentariosSeguimiento());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    public void testEvaluarSolicitud_RechazadaPorEdadAlTermino() {
        // Edad actual: 50 años (nacido en 1973), plazo: 26 años, edad al término: 76 años (>75)
        usuario.setFechaNacimiento(LocalDate.now().minusYears(50)); // Nacido hace 50 años
        solicitud.setPlazoSolicitado(26); // Plazo de 26 años

        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("RECHAZADA", resultado);
        assertEquals("RECHAZADA", solicitud.getEstadoSolicitud());
        assertEquals("Edad al término del préstamo excede los 75 años", solicitud.getComentariosSeguimiento());
        verify(solicitudRepository, times(1)).save(solicitud);
    }


    @Test
    public void testEvaluarSolicitud_RechazadaPorAntiguedadLaboral() {
        usuario.setAntiguedadLaboral(1); // Menos de 2 años

        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("RECHAZADA", resultado);
        assertEquals("RECHAZADA", solicitud.getEstadoSolicitud());
        assertEquals("Antigüedad laboral insuficiente", solicitud.getComentariosSeguimiento());
        verify(solicitudRepository, times(1)).save(solicitud);
    }

    @Test
    public void testEvaluarSolicitud_RechazadaPorCapacidadAhorro() {
        usuario.setCapacidadAhorro("INSUFICIENTE");

        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        String resultado = solicitudService.evaluarSolicitud(solicitud);

        assertEquals("RECHAZADA", resultado);
        assertEquals("RECHAZADA", solicitud.getEstadoSolicitud());
        assertEquals("Capacidad de ahorro insuficiente", solicitud.getComentariosSeguimiento());
        verify(solicitudRepository, times(1)).save(solicitud);
    }
}