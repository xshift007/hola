package com.prestabanco.app.controller;

import com.prestabanco.app.entity.Solicitud;
import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.dto.SimulacionRequest;
import com.prestabanco.app.dto.SimulacionResponse;
import com.prestabanco.app.exception.ResourceNotFoundException;
import com.prestabanco.app.service.FileStorageService;
import com.prestabanco.app.service.SolicitudService;
import com.prestabanco.app.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.io.File;
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

    @Autowired
    private SolicitudService solicitudService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/crear-con-usuario", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Solicitud crearSolicitudConUsuario(
            @RequestParam("tipoPrestamo") String tipoPrestamo,
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
            solicitud.setTipoPrestamo(tipoPrestamo);
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


    @GetMapping("/usuario/nombre/{nombreCompleto}")
    public List<Solicitud> obtenerSolicitudesPorNombreUsuario(@PathVariable String nombreCompleto) {
        Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorNombreCompleto(nombreCompleto);
        if (usuarioOpt.isPresent()) {
            return solicitudService.obtenerSolicitudesPorUsuario(usuarioOpt.get());
        } else {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
    }

    @GetMapping("/{id}")
    public Optional<Solicitud> obtenerSolicitudPorId(@PathVariable Long id) {
        return solicitudService.obtenerSolicitudPorId(id);
    }

    @GetMapping
    public List<Solicitud> obtenerTodasLasSolicitudes() {
        return solicitudService.obtenerTodasLasSolicitudes();
    }

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

    @PostMapping("/simular")
    public SimulacionResponse simularPrestamo(@RequestBody SimulacionRequest request) {
        BigDecimal monto = request.getMontoDeseado();
        BigDecimal tasaAnual = request.getTasaInteres();
        Integer plazoAnios = request.getPlazo();
        Integer plazoMeses = plazoAnios * 12;
        BigDecimal tasaMensual = tasaAnual.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);

        BigDecimal unoMasR = BigDecimal.ONE.add(tasaMensual);
        BigDecimal potencia = unoMasR.pow(plazoMeses, MathContext.DECIMAL128);
        BigDecimal cuotaMensual = monto.multiply(tasaMensual.multiply(potencia))
                .divide(potencia.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);

        BigDecimal totalPagado = cuotaMensual.multiply(BigDecimal.valueOf(plazoMeses));
        BigDecimal totalIntereses = totalPagado.subtract(monto);

        SimulacionResponse response = new SimulacionResponse();
        response.setCuotaMensual(cuotaMensual);
        response.setTotalPagado(totalPagado);
        response.setTotalIntereses(totalIntereses);

        return response;
    }
}
