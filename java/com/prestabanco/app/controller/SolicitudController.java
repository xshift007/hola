package com.prestabanco.app.controller;

import com.prestabanco.app.dto.SimulacionRequest;
import com.prestabanco.app.dto.SimulacionResponse;
import com.prestabanco.app.entity.Solicitud;
import com.prestabanco.app.entity.Usuario;
import com.prestabanco.app.exception.ResourceNotFoundException;
import com.prestabanco.app.service.FileStorageService;
import com.prestabanco.app.service.SolicitudService;
import com.prestabanco.app.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    /**
     * Crear una solicitud asociada a un usuario ya existente (identificado por nombreCompleto).
     * Subir comprobantes (avaluo, ingresos). Se contempla el campo valorPropiedad.
     */
    @PostMapping(value = "/crear-con-usuario", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Solicitud crearSolicitudConUsuario(
            @RequestParam("tipoPrestamo") String tipoPrestamo,
            @RequestParam("montoSolicitado") BigDecimal montoSolicitado,
            @RequestParam("plazoSolicitado") Integer plazoSolicitado,
            @RequestParam("tasaInteres") BigDecimal tasaInteres,
            @RequestParam("valorPropiedad") BigDecimal valorPropiedad,
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
            solicitud.setValorPropiedad(valorPropiedad);
            solicitud.setFechaSolicitud(LocalDateTime.now());
            // Por defecto E1: Revisión inicial
            solicitud.setEstadoSolicitud("E1_REVISION_INICIAL");

            // Guardar archivos
            String avaluoPath = fileStorageService.guardarArchivo(comprobanteAvaluo, "avaluos");
            String ingresosPath = fileStorageService.guardarArchivo(comprobanteIngresos, "ingresos");
            solicitud.setDocumentosAdjuntos(avaluoPath + "," + ingresosPath);

            return solicitudService.crearSolicitud(solicitud);
        } else {
            throw new ResourceNotFoundException("Usuario no encontrado para nombreCompleto: " + nombreCompleto);
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

    /**
     * Evaluar y aprobar/rechazar la solicitud según reglas de negocio.
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
     * Cambiar estado de la solicitud (por ejemplo, E2, E3, E4, etc.)
     * Aplica si deseas un endpoint para transicionar manualmente.
     */
    @PutMapping("/{id}/cambiar-estado")
    public Solicitud cambiarEstado(@PathVariable Long id, @RequestParam("nuevoEstado") String nuevoEstado) {
        Optional<Solicitud> solicitudOpt = solicitudService.obtenerSolicitudPorId(id);
        if (solicitudOpt.isEmpty()) {
            throw new ResourceNotFoundException("Solicitud no encontrada");
        }
        Solicitud sol = solicitudOpt.get();

        // Aquí podrías aplicar validaciones de si se permite pasar de E1 -> E2, etc.
        sol.setEstadoSolicitud(nuevoEstado);
        return solicitudService.actualizarSolicitud(sol);
    }

    /**
     * Simular un préstamo para ver cuota mensual, total pagado, etc.
     * Incluye cálculo opcional de costos adicionales (seguros, comisiones).
     */
    @PostMapping("/simular")
    public SimulacionResponse simularPrestamo(@RequestBody SimulacionRequest request) {
        BigDecimal monto = request.getMontoDeseado();
        BigDecimal tasaAnual = request.getTasaInteres();
        Integer plazoAnios = request.getPlazo() == null ? 0 : request.getPlazo();
        int plazoMeses = plazoAnios * 12;

        // Calcular cuota mensual
        BigDecimal tasaMensual = tasaAnual.divide(BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);
        BigDecimal unoMasR = BigDecimal.ONE.add(tasaMensual);
        BigDecimal potencia = unoMasR.pow(plazoMeses, MathContext.DECIMAL128);

        BigDecimal cuotaMensual = BigDecimal.ZERO;
        if (potencia.compareTo(BigDecimal.ONE) != 0) {
            cuotaMensual = monto.multiply(tasaMensual.multiply(potencia))
                    .divide(potencia.subtract(BigDecimal.ONE), 2, RoundingMode.HALF_UP);
        }

        // Calcular total pagado e intereses
        BigDecimal totalPagado = cuotaMensual.multiply(new BigDecimal(plazoMeses));
        BigDecimal totalIntereses = totalPagado.subtract(monto);

        // Calcular costos adicionales (opcional)
        BigDecimal costosAdicionales = BigDecimal.ZERO;
        if (request.getSeguros() != null) {
            costosAdicionales = costosAdicionales.add(request.getSeguros());
        }
        if (request.getComisiones() != null) {
            costosAdicionales = costosAdicionales.add(request.getComisiones());
        }

        BigDecimal totalFinal = totalPagado.add(costosAdicionales);

        SimulacionResponse response = new SimulacionResponse();
        response.setCuotaMensual(cuotaMensual);
        response.setTotalPagado(totalPagado);
        response.setTotalIntereses(totalIntereses);
        response.setCostosAdicionales(costosAdicionales);
        response.setTotalFinal(totalFinal);

        return response;
    }
}
