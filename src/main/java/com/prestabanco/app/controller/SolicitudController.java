// src/main/java/com/prestabanco/app/controller/SolicitudController.java

package com.prestabanco.app.controller;

import com.prestabanco.app.entity.Solicitud;
import com.prestabanco.app.entity.TipoPrestamo;
import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.dto.SimulacionRequest;
import com.prestabanco.app.dto.SimulacionResponse;
import com.prestabanco.app.exception.ResourceNotFoundException;
import com.prestabanco.app.service.FileStorageService;
import com.prestabanco.app.service.SolicitudService;
import com.prestabanco.app.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
// Asegúrate de importar correctamente las clases de validación
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private static final Logger logger = LoggerFactory.getLogger(SolicitudController.class);


    @Autowired
    private SolicitudService solicitudService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Endpoint para crear una solicitud de crédito con usuario existente.
     *
     * @param tipoPrestamo        Tipo de préstamo seleccionado (enumeración TipoPrestamo).
     * @param montoSolicitado     Monto solicitado para el préstamo.
     * @param plazoSolicitado     Plazo solicitado en años.
     * @param tasaInteres         Tasa de interés anual.
     * @param comprobanteAvaluo   Archivo del comprobante de avalúo.
     * @param comprobanteIngresos Archivo del comprobante de ingresos.
     * @param nombreCompleto      Nombre completo del usuario.
     * @return Solicitud creada.
     */
    @PostMapping(value = "/crear-con-usuario", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Solicitud crearSolicitudConUsuario(
            @RequestParam("tipoPrestamo") TipoPrestamo tipoPrestamo, // Cambiado a TipoPrestamo
            @RequestParam("montoSolicitado") BigDecimal montoSolicitado,
            @RequestParam("plazoSolicitado") Integer plazoSolicitado,
            @RequestParam("tasaInteres") BigDecimal tasaInteres,
            @RequestParam("comprobanteAvaluo") MultipartFile comprobanteAvaluo,
            @RequestParam("comprobanteIngresos") MultipartFile comprobanteIngresos,
            @RequestParam("nombreCompleto") String nombreCompleto
    ) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorNombreCompleto(nombreCompleto);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            Solicitud solicitud = new Solicitud();
            solicitud.setUsuario(usuario);
            solicitud.setTipoPrestamo(tipoPrestamo); // Usando el enum TipoPrestamo
            solicitud.setMontoSolicitado(montoSolicitado);
            solicitud.setPlazoSolicitado(plazoSolicitado);
            solicitud.setTasaInteres(tasaInteres);
            solicitud.setFechaSolicitud(LocalDateTime.now());
            solicitud.setEstadoSolicitud("EN_REVISION_INICIAL");

            // Guardar archivos usando el servicio
            String avaluoPath = fileStorageService.guardarArchivo(comprobanteAvaluo, "avaluos");
            String ingresosPath = fileStorageService.guardarArchivo(comprobanteIngresos, "ingresos");
            solicitud.setDocumentosAdjuntos(avaluoPath + "," + ingresosPath);

            return solicitudService.crearSolicitud(solicitud);
        } else {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
    }


    /**
     * Endpoint para obtener las solicitudes de crédito de un usuario por su nombre completo.
     *
     * @param nombreCompleto Nombre completo del usuario.
     * @return Lista de solicitudes de crédito.
     */
    @GetMapping("/usuario/nombre/{nombreCompleto}")
    public List<Solicitud> obtenerSolicitudesPorNombreUsuario(@PathVariable String nombreCompleto) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorNombreCompleto(nombreCompleto);
        if (usuarioOpt.isPresent()) {
            return solicitudService.obtenerSolicitudesPorUsuario(usuarioOpt.get());
        } else {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
    }

    /**
     * Endpoint para obtener una solicitud de crédito por su ID.
     *
     * @param id ID de la solicitud.
     * @return Solicitud encontrada.
     */
    @GetMapping("/{id}")
    public Optional<Solicitud> obtenerSolicitudPorId(@PathVariable Long id) {
        return solicitudService.obtenerSolicitudPorId(id);
    }

    /**
     * Endpoint para obtener todas las solicitudes de crédito.
     *
     * @return Lista de todas las solicitudes.
     */
    @GetMapping
    public List<Solicitud> obtenerTodasLasSolicitudes() {
        return solicitudService.obtenerTodasLasSolicitudes();
    }

    /**
     * Endpoint para evaluar una solicitud de crédito por su ID.
     *
     * @param id ID de la solicitud.
     * @return Resultado de la evaluación ("APROBADA" o "RECHAZADA").
     */
    @PutMapping("/{id}/evaluar")
    public String evaluarSolicitud(@PathVariable Long id) {
        Optional<Solicitud> optionalSolicitud = solicitudService.obtenerSolicitudPorId(id);
        if (optionalSolicitud.isPresent()) {
            String resultado = solicitudService.evaluarSolicitud(optionalSolicitud.get());
            return "La solicitud ha sido " + resultado;
        } else {
            throw new ResourceNotFoundException("Solicitud no encontrada");
        }
    }

    /**
     * Endpoint para eliminar una solicitud de crédito por su ID.
     *
     * @param id ID de la solicitud.
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarSolicitud(@PathVariable Long id) {
        Optional<Solicitud> solicitud =  solicitudService.obtenerSolicitudPorId(id);
        if(solicitud.isPresent()){
            solicitudService.eliminarSolicitud(id);
        } else{
            throw new ResourceNotFoundException("Solicitud no encontrada");
        }
    }

    /**
     * Endpoint para simular un préstamo hipotecario.
     *
     * @param request Objeto con los datos de la simulación.
     * @return Respuesta con los resultados de la simulación.
     */
    @PostMapping("/simular")
    public SimulacionResponse simularPrestamo(@Valid @RequestBody SimulacionRequest request) {
        // Validación y cálculo delegados al servicio SolicitudService
        return solicitudService.simularPrestamo(request);
    }
}
